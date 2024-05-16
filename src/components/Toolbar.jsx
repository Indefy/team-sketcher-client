import React from "react";
import "../styles/Toolbar.scss";

const Toolbar = ({
	onNewPage,
	onSavePage,
	onSharePage,
	onBrushSizeChange,
	onColorChange,
	onBackdropColorChange,
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
			<input
				className="color-picker"
				type="color"
				onChange={(e) => onColorChange(e.target.value)}
			/>
			<input
				className="color-picker"
				type="color"
				onChange={(e) => onBackdropColorChange(e.target.value)}
			/>
			<select
				className="brush-size"
				onChange={(e) => onBrushSizeChange(e.target.value)}
			>
				<option value="2">2px</option>
				<option value="4">4px</option>
				<option value="6">6px</option>
				<option value="8">8px</option>
				<option value="10">10px</option>
			</select>
		</div>
	);
};

export default Toolbar;
