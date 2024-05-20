import React, { useRef, useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Toolbar from "./Toolbar";
import UserToolbar from "./UserToolbar";
import UserList from "./UserList";
import "../styles/Whiteboard.scss";

const socket = io(process.env.REACT_APP_SERVER_URL);

const Whiteboard = () => {
	const canvasRef = useRef(null);
	const contextRef = useRef(null);
	const [brushSize, setBrushSize] = useState(5);
	const [color, setColor] = useState("black");
	const [backdropColor, setBackdropColor] = useState("#ffffff");
	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [canvasHistory, setCanvasHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isDrawing, setIsDrawing] = useState(false);

	useEffect(() => {
		if (!user) return;

		const canvas = canvasRef.current;
		const fixedWidth = 1280;
		const fixedHeight = 720;
		canvas.width = fixedWidth * 2;
		canvas.height = fixedHeight * 2;
		canvas.style.width = `${fixedWidth}px`;
		canvas.style.height = `${fixedHeight}px`;

		const context = canvas.getContext("2d");
		context.scale(2, 2);
		context.lineCap = "round";
		contextRef.current = context;

		socket.emit("userJoined", user);
		socket.on("updateUsers", handleUpdateUsers);
		socket.on("drawing", onDrawingEvent);

		return () => {
			socket.off("updateUsers", handleUpdateUsers);
			socket.off("drawing", onDrawingEvent);
		};
	}, [user]);

	const handleUpdateUsers = (connectedUsers) => {
		const uniqueUsers = connectedUsers.filter(
			(value, index, self) =>
				index === self.findIndex((u) => u.username === value.username)
		);
		setUsers(uniqueUsers);
	};

	useEffect(() => {
		if (contextRef.current) {
			contextRef.current.strokeStyle = color;
		}
	}, [color]);

	useEffect(() => {
		if (contextRef.current) {
			contextRef.current.lineWidth = brushSize;
		}
	}, [brushSize]);

	useEffect(() => {
		console.log(`Canvas history: `, canvasHistory);
		console.log(`History index: ${historyIndex}`);
	}, [canvasHistory, historyIndex]);

	if (!user) {
		return <Navigate to="/login" />;
	}

	const onDrawingEvent = (data) => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		const { x0, y0, x1, y1, color, brushSize } = data;
		context.strokeStyle = color;
		context.lineWidth = brushSize;
		context.beginPath();
		context.moveTo(x0, y0);
		context.lineTo(x1, y1);
		context.stroke();
	};

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
		contextRef.current.beginPath();
		contextRef.current.moveTo(x0, y0);
		contextRef.current.lineTo(x1, y1);
		contextRef.current.stroke();
		socket.emit("drawing", { x0, y0, x1, y1, color, brushSize });
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
		console.log(`History updated: `, newHistory);
		console.log(`New history index: ${newHistory.length - 1}`);
	};

	const handleNewPage = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		setCanvasHistory([]);
		setHistoryIndex(-1);
		console.log(`New page created. History cleared.`);
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

	const handleLogout = () => {
		socket.emit("userLeft", user);
		logout(navigate);
		setUsers([]); // Clear user list on logout to prevent stale data
		console.log("User logged out and users state reset.");
	};

	const handleBrushSizeChange = (size) => {
		setBrushSize(size);
		console.log(`Brush size changed to: ${size}`);
	};

	const handleColorChange = (color) => {
		setColor(color);
		console.log(`Color changed to: ${color}`);
	};

	const handleBackdropColorChange = (color) => {
		setBackdropColor(color);
		document.documentElement.style.setProperty("--backdrop-color", color);
		console.log(`Backdrop color changed to: ${color}`);
	};

	const handleUndo = () => {
		if (historyIndex > 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			restoreCanvas(canvasHistory[newIndex]);
			console.log(`Undo action performed. New history index: ${newIndex}`);
		} else if (historyIndex === 0) {
			const newIndex = historyIndex - 1;
			setHistoryIndex(newIndex);
			clearCanvas();
			console.log(`Undo action performed. Canvas cleared.`);
		} else {
			console.log(`Undo action ignored. No more history to undo.`);
		}
	};

	const handleRedo = () => {
		if (historyIndex < canvasHistory.length - 1) {
			const newIndex = historyIndex + 1;
			setHistoryIndex(newIndex);
			restoreCanvas(canvasHistory[newIndex]);
			console.log(`Redo action performed. New history index: ${newIndex}`);
		} else {
			console.log(`Redo action ignored. No more history to redo.`);
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
			console.log(`Canvas restored from history.`);
		};
	};

	const clearCanvas = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
		console.log(`Canvas cleared.`);
	};

	const handleExport = (format) => {
		const canvas = canvasRef.current;
		const link = document.createElement("a");
		link.href = canvas.toDataURL(`image/${format}`);
		link.download = `whiteboard.${format}`;
		link.click();
		console.log(`Canvas exported as: ${format}`);
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
				onBrushSizeChange={handleBrushSizeChange}
				onColorChange={handleColorChange}
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
			<button className="logout-button" onClick={handleLogout}>
				Logout
			</button>
		</div>
	);
};

export default Whiteboard;
