import { get, writable } from "svelte/store";
import { FileMetadata, Frames, FrameIndex } from "../../stores/Model.js";
// import { Selection } from "./Select.js";

export const UndoHistoryLength = writable(30);

/**
 * @description list of methods which should NOT be followed
 * by a save history state.
 */
// export const UndoHistoryAvoidCommands = writable({
export const UndoHistoryAvoidCommands = {
	deselectAll: true,
	addToSelection: true,
	highlight: true,
	download: true,
	setTool: true,
	setToolAssignment: true,
	foldedLinePreview: true,
	setGhostGraphCP: true,
	setGhostGraphFolded: true,
	setRulersCP: true,
	setRulerRaysCP: true,
	setRulerSegmentsCP: true,
	setRulersFolded: true,
	setRulerRaysFolded: true,
	setRulerSegmentsFolded: true,
	setGuideLinesCP: true,
	setGuideRaysCP: true,
	setGuideSegmentsCP: true,
	setGuideLinesFolded: true,
	setGuideRaysFolded: true,
	setGuideSegmentsFolded: true,
};
/**
 *
 */
export const UndoStack = writable([]);
/**
 *
 */
export const RedoStack = writable([]);
/**
 *
 */
export const cache = () => {
	const file = structuredClone(get(FileMetadata));
	const frames = structuredClone(get(Frames));
	const clone = { file, frames };
	UndoStack.update((undos) => {
		const undoList = [...undos, clone];
		if (undoList.length > get(UndoHistoryLength)) {
			undoList.shift();
		}
		return undoList;
	});
	RedoStack.set([]);
};
/**
 *
 */
// pop from undo stack, push to redo stack
export const undo = () => {
	let previous;
	UndoStack.update((un) => {
		previous = un.pop();
		return un;
	});
	if (!previous) {
		console.log("no prev");
		return;
	}
	let current = { file: get(FileMetadata), frames: get(Frames) };
	RedoStack.update((re) => [...re, current]);
	const { file, frames } = previous;
	FrameIndex.update((index) => Math.max(index, frames.length - 1));
	FileMetadata.set(file);
	Frames.set(frames);
	// Selection.reset();
};
/**
 *
 */
// pop from redo stack, push to undo stack
export const redo = () => {
	let next;
	RedoStack.update((re) => {
		next = re.pop();
		return re;
	});
	if (!next) {
		console.log("no next");
		return;
	}
	let current = { file: get(FileMetadata), frames: get(Frames) };
	UndoStack.update((un) => [...un, current]);
	const { file, frames } = next;
	FrameIndex.update((index) => Math.max(index, frames.length - 1));
	FileMetadata.set(file);
	Frames.set(frames);
	// Selection.reset();
};
