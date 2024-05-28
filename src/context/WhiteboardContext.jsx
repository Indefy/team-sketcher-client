import React, { createContext, useContext, useState } from "react";

const WhiteboardContext = createContext();

export const useWhiteboardContext = () => useContext(WhiteboardContext);

export const WhiteboardProvider = ({ children }) => {
	const [brushSize, setBrushSize] = useState(5);
	const [brushType, setBrushType] = useState("default");
	const [color, setColor] = useState("black");
	const [canvasHistory, setCanvasHistory] = useState([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [isDrawing, setIsDrawing] = useState(false);
	const [users, setUsers] = useState([]);

	return (
		<WhiteboardContext.Provider
			value={{
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
			}}
		>
			{children}
		</WhiteboardContext.Provider>
	);
};

// import React, { createContext, useContext, useState } from "react";

// const WhiteboardContext = createContext();

// export const useWhiteboardContext = () => useContext(WhiteboardContext);

// export const WhiteboardProvider = ({ children }) => {
// 	const [brushSize, setBrushSize] = useState(5);
// 	const [brushType, setBrushType] = useState("default");
// 	const [color, setColor] = useState("black");

// 	return (
// 		<WhiteboardContext.Provider
// 			value={{
// 				brushSize,
// 				setBrushSize,
// 				brushType,
// 				setBrushType,
// 				color,
// 				setColor,
// 			}}
// 		>
// 			{children}
// 		</WhiteboardContext.Provider>
// 	);
// };
