import React, {
	useRef,
	useEffect,
	useContext,
	useState,
	useCallback,
} from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext.mjs";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import UserToolbar from "./UserToolbar.mjs";
import UserList from "./UserList.mjs";
import { useWhiteboardContext } from "../context/WhiteboardContext.mjs";

import CustomToolbar from "./CustomToolbar.mjs";
import ThemeSelector from "./ThemeSelector.mjs";
import "../styles/Whiteboard.scss";
import "../styles/neumorphism.scss";
import "../styles/themes.scss";

// Initialize socket connection to the server
const socket = io(process.env.REACT_APP_SERVER_URL);

// Utility function to generate lighter and darker shades of a given color
const shadeColor = (color, percent) => {
	const f = parseInt(color.slice(1), 16);
	const t = percent < 0 ? 0 : 255;
	const p = percent < 0 ? percent * -1 : percent;
	const R = f >> 16;
	const G = (f >> 8) & 0x00ff;
	const B = f & 0x0000ff;
	return `#${(
		0x1000000 +
		(Math.round((t - R) * p) + R) * 0x10000 +
		(Math.round((t - G) * p) + G) * 0x100 +
		(Math.round((t - B) * p) + B)
	)
		.toString(16)
		.slice(1)}`;
};

const Whiteboard = () => {
	const canvasRef = useRef(null);
	const contextRef = useRef(null);
	// Destructure context values from useWhiteboardContext
	const {
		brushSize,
		brushType,
		color,
		setBrushSize,
		setBrushType,
		setColor,
		canvasHistory,
		setCanvasHistory,
		historyIndex,
		setHistoryIndex,
		isDrawing,
		setIsDrawing,
		users,
		setUsers,
	} = useWhiteboardContext();

	const [backdropColor] = useState("");
	const [canvasBackdropColor] = useState("#ffffff");
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [theme, setTheme] = useState("light");

	// Update users list when new users join or leave
	const handleUpdateUsers = useCallback(
		(connectedUsers) => {
			const uniqueUsers = connectedUsers.filter(
				(value, index, self) =>
					index === self.findIndex((u) => u.username === value.username)
			);
			setUsers(uniqueUsers);
		},
		[setUsers]
	);

	// Apply brush settings based on the selected brush type
	const applyBrushSettings = useCallback(
		(context, brushType, brushSize, color, x0, y0, x1, y1) => {
			context.setLineDash([]);
			context.globalAlpha = 1.0;
			context.shadowBlur = 0;
			context.shadowColor = "rgba(0, 0, 0, 0)";
			context.lineJoin = "round";

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
					context.setLineDash([brushSize, brushSize * 8]);
					context.lineDashOffset = brushSize / 2;
					context.lineWidth = brushSize;
					break;
				case "pattern":
					const patternCanvas = document.createElement("canvas");
					const patternContext = patternCanvas.getContext("2d");
					patternCanvas.width = brushSize * 2;
					patternCanvas.height = brushSize * 2;
					patternContext.fillStyle = color;
					patternContext.fillRect(0, 0, brushSize, brushSize);
					patternContext.fillRect(brushSize, brushSize, brushSize, brushSize);
					const pattern = context.createPattern(patternCanvas, "repeat");
					context.strokeStyle = pattern;
					break;
				case "fuzzy":
					context.globalAlpha = 0.2;
					context.lineCap = "round";
					context.lineWidth = brushSize * 3;
					break;
				case "calligraphy":
					context.lineCap = "butt";
					context.lineJoin = "miter";
					break;
				case "gradient":
					context.globalAlpha = 1;
					context.lineCap = "round";
					if (isFinite(x0) && isFinite(y0) && isFinite(x1) && isFinite(y1)) {
						const gradient = context.createLinearGradient(x0, y0, x1, y1);
						const lighterColor = shadeColor(color, 0.5); // 50% lighter
						const darkerColor = shadeColor(color, -0.5); // 50% darker
						gradient.addColorStop(0, lighterColor);
						gradient.addColorStop(0.5, color);
						gradient.addColorStop(1, darkerColor);
						context.strokeStyle = gradient;
					}
					break;
				case "shadow":
					context.lineCap = "round";
					context.shadowBlur = 14;
					context.shadowColor = "rgba(0, 0, 0, 0.7)";
					break;
				default:
					context.globalAlpha = 1;
					context.lineCap = "round";
					break;
			}
		},
		[]
	);

	// Handle drawing events from other users
	const onDrawingEvent = useCallback(
		(data) => {
			const { x0, y0, x1, y1, color, brushSize, brushType } = data;
			const context = contextRef.current;
			applyBrushSettings(context, brushType, brushSize, color, x0, y0, x1, y1);
			context.beginPath();
			context.moveTo(x0, y0);
			context.lineTo(x1, y1);
			context.stroke();
		},
		[applyBrushSettings]
	);

	// Interpolate points for smoother drawing
	const interpolatePoints = useCallback(
		(x0, y0, x1, y1) => {
			const distance = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
			const step = brushSize / 2;
			for (let i = step; i < distance; i += step) {
				const t = i / distance;
				const intermediateX = x0 + (x1 - x0) * t;
				const intermediateY = y0 + (y1 - y0) * t;
				contextRef.current.lineTo(intermediateX, intermediateY);
				contextRef.current.stroke();
			}
		},
		[brushSize]
	);

	// Main drawing function
	const drawLine = useCallback(
		({ offsetX, offsetY }) => {
			const x0 = canvasRef.current.lastX;
			const y0 = canvasRef.current.lastY;
			const x1 = offsetX;
			const y1 = offsetY;
			const data = { x0, y0, x1, y1, color, brushSize, brushType };
			applyBrushSettings(
				contextRef.current,
				brushType,
				brushSize,
				color,
				x0,
				y0,
				x1,
				y1
			);
			contextRef.current.beginPath();
			contextRef.current.moveTo(x0, y0);
			contextRef.current.lineTo(x1, y1);
			contextRef.current.stroke();
			socket.emit("drawing", data);
			canvasRef.current.lastX = offsetX;
			canvasRef.current.lastY = offsetY;
			interpolatePoints(x0, y0, x1, y1);
		},
		[applyBrushSettings, brushSize, brushType, color, interpolatePoints]
	);

	// Save the current state of the canvas to the history
	const saveCanvasState = useCallback(() => {
		const dataUrl = canvasRef.current.toDataURL();
		const newHistory = canvasHistory.slice(0, historyIndex + 1);
		newHistory.push(dataUrl);
		setCanvasHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	}, [canvasHistory, historyIndex, setCanvasHistory, setHistoryIndex]);

	// Initialize the canvas and socket events
	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const canvas = canvasRef.current;
		const fixedWidth = canvas.parentElement.clientWidth;
		const fixedHeight = canvas.parentElement.clientHeight;
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
	}, [user, navigate, onDrawingEvent, handleUpdateUsers]);

	// Apply brush settings whenever they change
	useEffect(() => {
		const context = contextRef.current;
		if (context) {
			applyBrushSettings(context, brushType, brushSize, color);
		}
	}, [brushSize, brushType, color, applyBrushSettings]);

	// Handle mouse down event
	const handleMouseDown = useCallback(
		({ nativeEvent }) => {
			const { offsetX, offsetY } = nativeEvent;
			canvasRef.current.isDrawing = true;
			setIsDrawing(true);
			canvasRef.current.lastX = offsetX;
			canvasRef.current.lastY = offsetY;
		},
		[setIsDrawing]
	);

	// Handle mouse move event
	const handleMouseMove = useCallback(
		({ nativeEvent }) => {
			if (!canvasRef.current.isDrawing) return;
			requestAnimationFrame(() => {
				drawLine(nativeEvent);
			});
		},
		[drawLine]
	);

	// Handle mouse up event
	const handleMouseUp = useCallback(() => {
		canvasRef.current.isDrawing = false;
		if (isDrawing) {
			saveCanvasState();
			setIsDrawing(false);
		}
	}, [isDrawing, saveCanvasState, setIsDrawing]);

	// Handle touch start event
	const handleTouchStart = (e) => {
		const touch = e.touches[0];
		const offsetX =
			touch.clientX - canvasRef.current.getBoundingClientRect().left;
		const offsetY =
			touch.clientY - canvasRef.current.getBoundingClientRect().top;
		handleMouseDown({ nativeEvent: { offsetX, offsetY } });
	};

	// Handle touch move event
	const handleTouchMove = (e) => {
		e.preventDefault();
		const touch = e.touches[0];
		const offsetX =
			touch.clientX - canvasRef.current.getBoundingClientRect().left;
		const offsetY =
			touch.clientY - canvasRef.current.getBoundingClientRect().top;
		handleMouseMove({ nativeEvent: { offsetX, offsetY } });
	};

	// Handle touch end event
	const handleTouchEnd = () => {
		handleMouseUp();
	};

	// Clear the canvas for a new page
	const handleNewPage = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		setCanvasHistory([]);
		setHistoryIndex(-1);
	};

	// Save the current canvas as an image
	const handleSavePage = () => {
		const canvas = canvasRef.current;
		const tempCanvas = document.createElement("canvas");
		const tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = canvas.width;
		tempCanvas.height = canvas.height;
		tempContext.fillStyle = backdropColor;
		tempContext.fillStyle = canvasBackdropColor;
		tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
		tempContext.drawImage(canvas, 0, 0);

		const link = document.createElement("a");
		link.href = tempCanvas.toDataURL("image/png");
		link.download = "whiteboard.png";
		link.click();
	};

	// Placeholder function for sharing the page
	const handleSharePage = () => {
		alert("Share functionality to be implemented");
	};

	// Undo the last action
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

	// Redo the last undone action
	const handleRedo = () => {
		if (historyIndex < canvasHistory.length - 1) {
			const newIndex = historyIndex + 1;
			setHistoryIndex(newIndex);
			restoreCanvas(canvasHistory[newIndex]);
		}
	};

	// Restore the canvas from a saved state
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

	// Clear the canvas
	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
	};

	// Export the canvas as a PDF
	const handleExport = () => {
		const canvas = canvasRef.current;
		const canvasWidth = canvas.width / 2;
		const canvasHeight = canvas.height / 2;

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
	};

	// Handle user logout
	const handleLogout = () => {
		socket.emit("userLeft", user);
		logout(navigate);
		setUsers([]);
		console.log("User logged out and users state reset.");
	};

	return (
		<div
			className="whiteboard-container"
			style={{ "--backdrop-color": backdropColor }}
		>
			<CustomToolbar
				onNewPage={handleNewPage}
				onSavePage={handleSavePage}
				onSharePage={handleSharePage}
				onUndo={handleUndo}
				onRedo={handleRedo}
				onExport={handleExport}
			/>
			<UserToolbar
				onBrushSizeChange={setBrushSize}
				onBrushTypeChange={setBrushType}
				onColorChange={setColor}
			/>
			<UserList users={users} />
			<div className="canvas-container">
				<canvas
					id="board"
					ref={canvasRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseOut={handleMouseUp}
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
					style={{
						border: "2px solid var(--canvas-border-color)",
						touchAction: "none",
					}}
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
