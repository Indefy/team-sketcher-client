import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import PdfIcon from "@mui/icons-material/PictureAsPdfRounded";
import { useTheme } from "../context/ThemeContext";
import "../styles/CustomToolbar.scss";

const CustomToolbar = ({
	onNewPage,
	onSavePage,
	onSharePage,
	onUndo,
	onRedo,
	onExport,
}) => {
	const { muiTheme } = useTheme();

	return (
		<AppBar position="absolute" color="default" top="0" elevation={1}>
			<Toolbar
				className="custom-toolbar"
				style={{ background: muiTheme.gradient }}
			>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						width: "100%",
					}}
				>
					<Box>
						<IconButton
							onClick={onNewPage}
							color="primary"
							aria-label="new page"
						>
							<AddBoxIcon />
						</IconButton>
						<IconButton
							onClick={onSavePage}
							color="primary"
							aria-label="save page"
						>
							<SaveIcon />
						</IconButton>
						<IconButton
							onClick={onSharePage}
							color="primary"
							aria-label="share page"
						>
							<ShareIcon />
						</IconButton>
					</Box>
					<Box>
						<IconButton onClick={onUndo} color="primary" aria-label="undo">
							<UndoIcon />
						</IconButton>
						<IconButton onClick={onRedo} color="primary" aria-label="redo">
							<RedoIcon />
						</IconButton>
						<IconButton
							onClick={onExport}
							color="primary"
							aria-label="export pdf"
						>
							<PdfIcon />
						</IconButton>
					</Box>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default CustomToolbar;
