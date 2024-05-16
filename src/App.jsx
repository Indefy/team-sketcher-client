import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Whiteboard from "./components/Whiteboard";
import Login from "./components/Login";
import Register from "./components/Register";
import "./styles/global.scss";

const App = () => {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/" element={<Whiteboard />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
};

export default App;
