import React, { createContext, useState, useContext } from "react";

// Create the Whiteboard context
const WhiteboardContext = createContext();

// Custom hook to use the Whiteboard context
export const useWhiteboardContext = () => useContext(WhiteboardContext);

export const WhiteboardProvider = ({ children }) => {
	// State Management for Whiteboard inside WhiteboardContext
	const [brushSize, setBrushSize] = useState(5);
	const [brushType, setBrushType] = useState("round");
	const [color, setColor] = useState("#000000");
	const [canvasHistory, setCanvasHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isDrawing, setIsDrawing] = useState(false);
	const [users, setUsers] = useState([]);

	// Object containing all the whiteboard state and functions to update them
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

	// Return the WhiteboardContext.Provider with the value object to supply the state and functions to children components
	return (
		<WhiteboardContext.Provider value={value}>
			{children}
		</WhiteboardContext.Provider>
	);
};
