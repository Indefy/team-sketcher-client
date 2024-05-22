import React, {
	useRef,
	useEffect,
	useContext,
	useState,
	useCallback,
} from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import Toolbar from "./Toolbar";
import UserToolbar from "./UserToolbar";
import UserList from "./UserList";
import "../styles/Whiteboard.scss";
import { useWhiteboardContext } from "../context/WhiteboardContext";

//==TEST
import ThemeSelector from "./ThemeSelector";
import "../styles/Whiteboard.scss";
import "../styles/neumorphism.scss";
import "../styles/themes.scss";
import "../styles/AnimatedBackground.scss";
//==TEST

const socket = io(process.env.REACT_APP_SERVER_URL);

const Whiteboard = () => {
	const { brushSize, brushType, color, setBrushSize, setBrushType, setColor } =
		useWhiteboardContext();
	const canvasRef = useRef(null);
	const contextRef = useRef(null);
	const [backdropColor, setBackdropColor] = useState("#ffffff");
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [canvasHistory, setCanvasHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isDrawing, setIsDrawing] = useState(false);

	//===TEST
	const [theme, setTheme] = useState("light");
	//===TEST

	const handleUpdateUsers = (connectedUsers) => {
		const uniqueUsers = connectedUsers.filter(
			(value, index, self) =>
				index === self.findIndex((u) => u.username === value.username)
		);
		setUsers(uniqueUsers);
	};

	const applyBrushSettings = useCallback(
		(context, brushType, brushSize, color) => {
			// Resetting context properties
			context.setLineDash([]);
			context.globalAlpha = 1.0;
			context.shadowBlur = 0;
			context.shadowColor = "rgba(0, 0, 0, 0)";
			context.lineJoin = "round"; // Default line join style

			context.lineWidth = brushSize;
			context.strokeStyle = color;

			switch (brushType) {
				case "round":
					context.lineCap = "round";
					break;
				case "square":
					context.lineCap = "butt";
					break;
				case "dotted":
					context.lineCap = "round";
					context.setLineDash([brushSize, brushSize]);
					break;
				case "pattern":
					// Add pattern or custom texture logic here
					break;
				case "fuzzy":
					context.globalAlpha = 0.2;
					context.lineWidth = brushSize * 3;
					break;
				case "calligraphy":
					context.lineCap = "butt";
					context.lineJoin = "miter";
					break;
				case "gradient":
					const gradient = context.createLinearGradient(0, 0, 170, 0);
					gradient.addColorStop(0, color);
					gradient.addColorStop(1, "white");
					context.strokeStyle = gradient;
					break;
				case "shadow":
					context.lineCap = "round";
					context.shadowBlur = 10;
					context.shadowColor = "rgba(0, 0, 0, 0.5)";
					break;
				default:
					context.lineCap = "round";
					break;
			}
		},
		[]
	);

	const onDrawingEvent = useCallback(
		(data) => {
			const { x0, y0, x1, y1, color, brushSize, brushType } = data;
			const context = contextRef.current;
			applyBrushSettings(context, brushType, brushSize, color);

			context.beginPath();
			context.moveTo(x0, y0);
			context.lineTo(x1, y1);
			context.stroke();
		},
		[applyBrushSettings]
	);

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const canvas = canvasRef.current;
		const fixedWidth = 1280;
		const fixedHeight = 720;
		canvas.width = fixedWidth * 2;
		canvas.height = fixedHeight * 2;
		canvas.style.width = `${fixedWidth}px`;
		canvas.style.height = `${fixedHeight}px`;

		const context = canvas.getContext("2d");
		context.scale(2, 2);
		contextRef.current = context;

		socket.emit("userJoined", user);
		socket.on("updateUsers", handleUpdateUsers);
		socket.on("drawing", onDrawingEvent);

		return () => {
			socket.off("updateUsers", handleUpdateUsers);
			socket.off("drawing", onDrawingEvent);
		};
	}, [user, navigate, onDrawingEvent]);

	useEffect(() => {
		const context = contextRef.current;
		if (context) {
			applyBrushSettings(context, brushType, brushSize, color);
		}
	}, [brushSize, brushType, color, applyBrushSettings]);

	const handleMouseDown = ({ nativeEvent }) => {
		const { offsetX, offsetY } = nativeEvent;
		canvasRef.current.isDrawing = true;
		setIsDrawing(true);
		canvasRef.current.lastX = offsetX;
		canvasRef.current.lastY = offsetY;
	};

	const handleMouseMove = ({ nativeEvent }) => {
		if (!canvasRef.current.isDrawing) return;
		const { offsetX, offsetY } = nativeEvent;
		const x0 = canvasRef.current.lastX;
		const y0 = canvasRef.current.lastY;
		const x1 = offsetX;
		const y1 = offsetY;
		const data = { x0, y0, x1, y1, color, brushSize, brushType };
		contextRef.current.beginPath();
		contextRef.current.moveTo(x0, y0);
		contextRef.current.lineTo(x1, y1);
		contextRef.current.stroke();
		socket.emit("drawing", data);
		canvasRef.current.lastX = offsetX;
		canvasRef.current.lastY = offsetY;
	};

	const handleMouseUp = () => {
		canvasRef.current.isDrawing = false;
		if (isDrawing) {
			saveCanvasState();
			setIsDrawing(false);
		}
	};

	const saveCanvasState = () => {
		const dataUrl = canvasRef.current.toDataURL();
		const newHistory = canvasHistory.slice(0, historyIndex + 1);
		newHistory.push(dataUrl);
		setCanvasHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	};

	const handleNewPage = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		setCanvasHistory([]);
		setHistoryIndex(-1);
	};

	const handleSavePage = () => {
		const canvas = canvasRef.current;
		const tempCanvas = document.createElement("canvas");
		const tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = canvas.width;
		tempCanvas.height = canvas.height;
		tempContext.fillStyle = backdropColor;
		tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempContext.drawImage(canvas, 0, 0);

		const link = document.createElement("a");
		link.href = tempCanvas.toDataURL("image/png");
		link.download = "whiteboard.png";
		link.click();
	};

	const handleSharePage = () => {
		alert("Share functionality to be implemented");
	};

	const handleBackdropColorChange = (color) => {
		setBackdropColor(color);
		document.documentElement.style.setProperty("--backdrop-color", color);
	};

	const handleUndo = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			restoreCanvas(canvasHistory[newIndex]);
		} else if (historyIndex === 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			clearCanvas();
		}
	};

	const handleRedo = () => {
		if (historyIndex < canvasHistory.length - 1) {
			const newIndex = historyIndex + 1;
			setHistoryIndex(newIndex);
			restoreCanvas(canvasHistory[newIndex]);
		}
	};

	const restoreCanvas = (dataUrl) => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		const img = new Image();
		img.src = dataUrl;
		img.onload = () => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
		};
	};

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
	};

	const handleExport = (format) => {
		const canvas = canvasRef.current;
		const link = document.createElement("a");

		if (format === "png") {
			link.href = canvas.toDataURL("image/png");
			link.download = "whiteboard.png";
		} else if (format === "jpeg") {
			link.href = canvas.toDataURL("image/jpeg");
			link.download = "whiteboard.jpeg";
		} else if (format === "pdf") {
			const canvasWidth = canvas.width / 2; // Divide by 2 to account for the scaling applied to the canvas
			const canvasHeight = canvas.height / 2; // Divide by 2 to account for the scaling applied to the canvas
			const pdf = new jsPDF({
				orientation: canvasWidth > canvasHeight ? "landscape" : "portrait",
				unit: "px",
				format: [canvasWidth, canvasHeight],
			});
			pdf.addImage(
				canvas.toDataURL("image/png"),
				"PNG",
				0,
				0,
				canvasWidth,
				canvasHeight
			);
			pdf.save("whiteboard.pdf");
			return;
		}

		link.click();
	};

	const handleLogout = () => {
		socket.emit("userLeft", user);
		logout(navigate);
		setUsers([]); // Clear user list on logout to prevent stale data
		console.log("User logged out and users state reset.");
	};

	return (
		<div
			className="whiteboard-container"
			style={{ "--backdrop-color": backdropColor }}
		>
			<Toolbar
				onNewPage={handleNewPage}
				onSavePage={handleSavePage}
				onSharePage={handleSharePage}
				onUndo={handleUndo}
				onRedo={handleRedo}
				onClearCanvas={handleNewPage}
				onExport={handleExport}
				onBackdropColorChange={handleBackdropColorChange}
			/>
			<UserToolbar
				onBrushSizeChange={setBrushSize}
				onBrushTypeChange={setBrushType}
				onColorChange={setColor}
			/>
			<UserList users={users} />
			<div className="canvas-container">
				<canvas
					ref={canvasRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseOut={handleMouseUp}
					style={{ border: "2px solid black" }}
				/>
			</div>
			<ThemeSelector onThemeChange={setTheme} theme={theme} />
			<button className="logout-button" onClick={handleLogout}>
				Logout
			</button>
		</div>
	);
};

export default Whiteboard;
