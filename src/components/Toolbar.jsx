import React from "react";
import ThemeSelector from "./ThemeSelector";
import "../styles/Toolbar.scss";

const Toolbar = ({
	onNewPage,
	onSavePage,
	onSharePage,
	onUndo,
	onRedo,
	onExport,
}) => {
	return (
		<div className="toolbar-container">
			<button className="toolbar-button" onClick={onNewPage}>
				New Page
			</button>
			<button className="toolbar-button" onClick={onSavePage}>
				Save Page
			</button>
			<button className="toolbar-button" onClick={onSharePage}>
				Share Page
			</button>
			<button className="toolbar-button" onClick={onUndo}>
				Undo
			</button>
			<button className="toolbar-button" onClick={onRedo}>
				Redo
			</button>
			<button className="toolbar-button" onClick={() => onExport("png")}>
				Export PNG
			</button>
			<button className="toolbar-button" onClick={() => onExport("jpeg")}>
				Export JPEG
			</button>
			<button className="toolbar-button" onClick={() => onExport("pdf")}>
				Export PDF
			</button>
			<ThemeSelector />
		</div>
	);
};

export default Toolbar;
