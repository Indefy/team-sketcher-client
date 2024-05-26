import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { WhiteboardProvider } from "./context/WhiteboardContext";
import Whiteboard from "./components/Whiteboard";
import Login from "./components/Login";
import Register from "./components/Register";
import ThemeSelector from "./components/ThemeSelector";
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
