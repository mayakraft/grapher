import {
	Frames,
	FrameIndex,
	UpdateFrame,
	IsoUpdateFrame,
	SetFrame,
} from "../../stores/Model.js";
import {
	NewFile,
	LoadFOLDFile,
	GetCurrentFOLDFile,
} from "../../stores/File.js";
import { makeEmptyGraph } from "../../js/graph.js";
/**
 * @description Browser only. Download a file with text contents.
 * @param {string} contents already in a string format
 * @param {string} filename
 */
const downloadFile = (contents, filename = "origami.fold") => {
	const element = document.createElement("a");
	element.setAttribute(
		"href",
		"data:text/plain;charset=utf-8," + encodeURIComponent(contents),
	);
	element.setAttribute("download", filename);
	element.style.display = "none";
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
};
/**
 * @description load a FOLD object and replace the currently loaded file
 */
export const newFile = () => NewFile();
/**
 * @description load a FOLD object and replace the currently loaded file
 */
export const load = (FOLD = {}) => LoadFOLDFile(FOLD);
/**
 * @description Trigger an in-browser downloading of a file to the
 * browser's default download location. Not useful for native app build.
 */
export const download = (filename) =>
	downloadFile(JSON.stringify(GetCurrentFOLDFile()), filename);
/**
 * @description
 */
export const exportImage = (format = "svg") => {
	switch (format) {
		case "svg":
			break;
		case "png":
			break;
		default:
			break;
	}
};
