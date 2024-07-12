import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.mjs";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.scss";

const Register = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const { register, error } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		register(username, password, navigate);
	};

	return (
		<div className="register-container">
			<h2 className="register-title">Register</h2>
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					className="register-input"
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					className="register-input"
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="register-button" type="submit">
					Register
				</button>
			</form>
			<p className="link-text">
				Already have an account? <Link to="/login">Login here</Link>
			</p>
		</div>
	);
};

export default Register;
