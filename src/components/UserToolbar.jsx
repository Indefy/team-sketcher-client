import React from "react";
import { useWhiteboardContext } from "../context/WhiteboardContext";

const UserToolbar = () => {
	const { setBrushSize, setBrushType, setColor } = useWhiteboardContext();

	return (
		<div className="user-toolbar">
			<label htmlFor="brush-size">Brush Size: </label>
			<select
				id="brush-size"
				defaultValue="5"
				onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
			>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="20">20</option>
			</select>

			<label htmlFor="brush-type">Brush Type: </label>
			<select
				id="brush-type"
				defaultValue="default"
				onChange={(e) => setBrushType(e.target.value)}
			>
				<option value="default">Default</option>
				<option value="round">Round</option>
				<option value="square">Square</option>
				<option value="dotted">Dotted</option>
				<option value="pattern">Pattern</option>
				<option value="fuzzy">Fuzzy</option>
				<option value="calligraphy">Calligraphy</option>
				<option value="gradient">Gradient</option>
				<option value="shadow">Shadow</option>
			</select>

			<label htmlFor="color">Color: </label>
			<input
				type="color"
				id="color"
				defaultValue="#000000"
				onChange={(e) => setColor(e.target.value)}
			/>
		</div>
	);
};

export default UserToolbar;
