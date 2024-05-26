import React, { createContext, useState, useEffect, useContext } from "react";
import {
	createTheme,
	ThemeProvider as MUIThemeProvider,
	CssBaseline,
} from "@mui/material";
import "../styles/themes.scss";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState("light");

	useEffect(() => {
		const root = document.documentElement;
		root.className = theme === "light" ? "light-theme" : "dark-theme";
	}, [theme]);

	const muiTheme = createTheme({
		palette: {
			mode: theme,
			...(theme === "light"
				? {
						background: {
							default: "#f0f0f3",
						},
						text: {
							primary: "#333333",
						},
				  }
				: {
						background: {
							default: "#333333",
						},
						text: {
							primary: "#f0f0f3",
						},
				  }),
		},
	});

	const changeTheme = (newTheme) => {
		setTheme(newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, changeTheme }}>
			<MUIThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</ThemeContext.Provider>
	);
};

export { ThemeProvider, ThemeContext };
