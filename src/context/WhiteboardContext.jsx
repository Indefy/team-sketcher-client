import React, { createContext, useState, useContext } from "react";

const WhiteboardContext = createContext();

export const useWhiteboardContext = () => useContext(WhiteboardContext);

export const WhiteboardProvider = ({ children }) => {
	const [brushSize, setBrushSize] = useState(5);
	const [brushType, setBrushType] = useState("round");
	const [color, setColor] = useState("#000000");
	const [canvasHistory, setCanvasHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isDrawing, setIsDrawing] = useState(false);
	const [users, setUsers] = useState([]);

	const value = {
		brushSize,
		setBrushSize,
		brushType,
		setBrushType,
		color,
		setColor,
		canvasHistory,
		setCanvasHistory,
		historyIndex,
		setHistoryIndex,
		isDrawing,
		setIsDrawing,
		users,
		setUsers,
	};

	return (
		<WhiteboardContext.Provider value={value}>
			{children}
		</WhiteboardContext.Provider>
	);
};
