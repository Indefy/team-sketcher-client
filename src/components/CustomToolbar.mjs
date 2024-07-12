import React from "react";
import { AppBar, Toolbar, IconButton, Box } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox.js";
import SaveIcon from "@mui/icons-material/Save.js";
import ShareIcon from "@mui/icons-material/Share.js";
import UndoIcon from "@mui/icons-material/Undo.js";
import RedoIcon from "@mui/icons-material/Redo.js";
import PdfIcon from "@mui/icons-material/PictureAsPdfRounded.js";
import { useTheme } from "../context/ThemeContext.mjs";
import "../styles/CustomToolbar.scss";

const unwrapDefault = (mod) => (mod && mod.default) || mod;

const UnwrappedAppBar = unwrapDefault(AppBar);
const UnwrappedToolbar = unwrapDefault(Toolbar);
const UnwrappedIconButton = unwrapDefault(IconButton);
const UnwrappedBox = unwrapDefault(Box);
const UnwrappedAddBoxIcon = unwrapDefault(AddBoxIcon);
const UnwrappedSaveIcon = unwrapDefault(SaveIcon);
const UnwrappedShareIcon = unwrapDefault(ShareIcon);
const UnwrappedUndoIcon = unwrapDefault(UndoIcon);
const UnwrappedRedoIcon = unwrapDefault(RedoIcon);
const UnwrappedPdfIcon = unwrapDefault(PdfIcon);

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
		<UnwrappedAppBar position="absolute" color="default" top="0" elevation={1}>
			<UnwrappedToolbar
				className="custom-toolbar"
				style={{ background: muiTheme.palette.gradient }}
			>
				<UnwrappedBox
					sx={{
						display: "flex",
						justifyContent: "center",
						width: "100%",
					}}
				>
					<UnwrappedBox>
						<UnwrappedIconButton
							onClick={onNewPage}
							color="primary"
							aria-label="new page"
						>
							<UnwrappedAddBoxIcon />
						</UnwrappedIconButton>
						<UnwrappedIconButton
							onClick={onSavePage}
							color="primary"
							aria-label="save page"
						>
							<UnwrappedSaveIcon />
						</UnwrappedIconButton>
						<UnwrappedIconButton
							onClick={onSharePage}
							color="primary"
							aria-label="share page"
						>
							<UnwrappedShareIcon />
						</UnwrappedIconButton>
					</UnwrappedBox>
					<UnwrappedBox>
						<UnwrappedIconButton
							onClick={onUndo}
							color="primary"
							aria-label="undo"
						>
							<UnwrappedUndoIcon />
						</UnwrappedIconButton>
						<UnwrappedIconButton
							onClick={onRedo}
							color="primary"
							aria-label="redo"
						>
							<UnwrappedRedoIcon />
						</UnwrappedIconButton>
						<UnwrappedIconButton
							onClick={onExport}
							color="primary"
							aria-label="export pdf"
						>
							<UnwrappedPdfIcon />
						</UnwrappedIconButton>
					</UnwrappedBox>
				</UnwrappedBox>
			</UnwrappedToolbar>
		</UnwrappedAppBar>
	);
};

export default CustomToolbar;
