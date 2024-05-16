import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			setUser(true);
		}
	}, []);

	// Navigate to the whiteboard page after login
	const login = async (username, password, navigate) => {
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
				{ username, password }
			);
			localStorage.setItem("token", data.token);
			axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
			setUser(true);
			setError(null);
			navigate("/");
		} catch (error) {
			setError(error.response?.data?.message || "Login failed");
		}
	};

	// Navigate to the whiteboard page after registration
	const register = async (username, password, navigate) => {
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/auth/register`,
				{ username, password }
			);
			localStorage.setItem("token", data.token);
			axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
			setUser(true);
			setError(null);
			navigate("/");
		} catch (error) {
			setError(error.response?.data?.message || "Registration failed");
		}
	};

	// Navigate to the login page after logout
	const logout = () => {
		localStorage.removeItem("token");
		delete axios.defaults.headers.common["Authorization"];
		setUser(null);
		setError(null);
		navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout, error }}>
			{children}
		</AuthContext.Provider>
	);
};

export { AuthProvider, AuthContext };
