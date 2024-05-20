import React from "react";

const UserToolbar = ({ onBrushSizeChange, onColorChange }) => {
	return (
		<div className="user-toolbar">
			<label htmlFor="brush-size">Brush Size: </label>
			<select
				id="brush-size"
				defaultValue="5"
				onChange={(e) => onBrushSizeChange(parseInt(e.target.value, 10))}
			>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
			</select>

			<label htmlFor="color">Color: </label>
			<input
				type="color"
				id="color"
				defaultValue="#000000"
				onChange={(e) => onColorChange(e.target.value)}
			/>
		</div>
	);
};

export default UserToolbar;
