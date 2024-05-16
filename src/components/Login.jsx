import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.scss";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { login, error } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		login(username, password, navigate);
	};

	return (
		<div className="login-container">
			<h2 className="login-title">Login</h2>
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					className="login-input"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					className="login-input"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="login-button" type="submit">
					Login
				</button>
			</form>
			<p className="link-text">
				Don't have an account? <Link to="/register">Register here</Link>
			</p>
		</div>
	);
};

export default Login;
