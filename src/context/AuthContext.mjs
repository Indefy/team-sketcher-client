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
			const storedUser = JSON.parse(localStorage.getItem("user"));
			setUser(storedUser);
		}
	}, []);

	const login = async (username, password) => {
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
				{ username, password }
			);
			const userWithProfile = { username, profilePic: "default.png" };
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(userWithProfile));
			axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
			setUser(userWithProfile);
			setError(null);
			navigate("/");
		} catch (error) {
			setError(error.response?.data?.message || "Login failed");
		}
	};

	const register = async (username, password) => {
		try {
			const { data } = await axios.post(
				`${process.env.REACT_APP_SERVER_URL}/api/auth/register`,
				{ username, password }
			);
			const userWithProfile = { username, profilePic: "default.png" };
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(userWithProfile));
			axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
			setUser(userWithProfile);
			setError(null);
			navigate("/");
		} catch (error) {
			setError(error.response?.data?.message || "Registration failed");
		}
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
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
