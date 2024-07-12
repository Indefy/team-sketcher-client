import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.mjs";
import { ThemeProvider } from "./context/ThemeContext.mjs";
import { WhiteboardProvider } from "./context/WhiteboardContext.mjs";
import Whiteboard from "./components/Whiteboard.mjs";
import Login from "./components/Login.mjs";
import Register from "./components/Register.mjs";
import ThemeSelector from "./components/ThemeSelector.mjs";
import "./styles/global.scss";

const App = () => {
	return (
		<Router>
			<ThemeProvider>
				<AuthProvider>
					<WhiteboardProvider>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
							<Route path="/" element={<Whiteboard />} />
						</Routes>
						<ThemeSelector />
					</WhiteboardProvider>
				</AuthProvider>
			</ThemeProvider>
		</Router>
	);
};

export default App;
