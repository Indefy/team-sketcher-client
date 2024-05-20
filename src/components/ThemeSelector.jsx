import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/ThemeSelector.scss";

const ThemeSelector = () => {
	const { changeTheme } = useContext(ThemeContext);

	return (
		<div className="theme-selector">
			<label htmlFor="theme-select">Choose Theme:</label>
			<select id="theme-select" onChange={(e) => changeTheme(e.target.value)}>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="ocean">Ocean</option>
			</select>
		</div>
	);
};

export default ThemeSelector;
