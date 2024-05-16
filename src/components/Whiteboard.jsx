import React, { useRef, useEffect, useContext, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import Toolbar from "./Toolbar";
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

	useEffect(() => {
		if (!user) return;

		const canvas = canvasRef.current;
		canvas.width = window.innerWidth * 2;
		canvas.height = window.innerHeight * 2;
		canvas.style.width = `${window.innerWidth}px`;
		canvas.style.height = `${window.innerHeight}px`;

		const context = canvas.getContext("2d");
		context.scale(2, 2);
		context.lineCap = "round";
		contextRef.current = context;

		socket.on("drawing", onDrawingEvent);

		return () => {
			socket.off("drawing", onDrawingEvent);
		};
	}, [user]);

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
	};

	const handleNewPage = () => {
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		context.clearRect(0, 0, canvas.width, canvas.height);
	};

	const handleSavePage = () => {
		const canvas = canvasRef.current;

		// Create a temporary canvas to draw the background color
		const tempCanvas = document.createElement("canvas");
		const tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = canvas.width;
		tempCanvas.height = canvas.height;

		// Fill the temporary canvas with the background color
		tempContext.fillStyle = backdropColor;
		tempContext.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

		// Draw the original content on top
		tempContext.drawImage(canvas, 0, 0);

		// Create the image
		const link = document.createElement("a");
		link.href = tempCanvas.toDataURL("image/png");
		link.download = "whiteboard.png";
		link.click();
	};

	const handleSharePage = () => {
		// Implement sharing functionality (e.g., via email or social media)
		alert("Share functionality to be implemented");
	};

	const handleLogout = () => {
		logout(navigate);
	};

	const handleBrushSizeChange = (size) => {
		setBrushSize(size);
	};

	const handleColorChange = (color) => {
		setColor(color);
	};

	const handleBackdropColorChange = (color) => {
		setBackdropColor(color);
		document.documentElement.style.setProperty("--backdrop-color", color);
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
				onBrushSizeChange={handleBrushSizeChange}
				onColorChange={handleColorChange}
				onBackdropColorChange={handleBackdropColorChange}
			/>
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
