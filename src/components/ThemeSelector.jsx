import React from "react";
import { useTheme } from "../context/ThemeContext";
import "../styles/ThemeSelector.scss";
import "../context/ThemeContext";
import "../styles/themes.scss";

const ThemeSelector = () => {
	const { theme, changeTheme } = useTheme();

	const handleThemeChange = (e) => {
		changeTheme(e.target.value);
	};

	return (
		<div className="theme-selector">
			<label htmlFor="theme-select">Theme:</label>
			<select id="theme-select" value={theme} onChange={handleThemeChange}>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
	);
};

export default ThemeSelector;
