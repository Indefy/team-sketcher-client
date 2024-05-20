import React, { createContext, useState, useEffect } from "react";
import themes from "../themes";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const root = document.documentElement;
		const selectedTheme = themes[theme];
		Object.keys(selectedTheme).forEach((property) => {
			root.style.setProperty(property, selectedTheme[property]);
		});
	}, [theme]);

	const changeTheme = (newTheme) => {
		setTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, changeTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export { ThemeProvider, ThemeContext };
