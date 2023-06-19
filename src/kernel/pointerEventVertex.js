import { subtract2 } from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { selected } from "../stores/select.js";
import {
	presses,
	moves,
	releases,
	current
} from "../stores/ui.js";
import { didTouchVertex } from "../js/nearest.js";
import { execute } from "./app.js";

export const pointerEventVertex = (eventType) => {
	switch (eventType) {
	case "press":
		const near = didTouchVertex(get(current));
		if (near !== undefined) {
			const vertices = [];
			vertices[near] = true;
			selected.set({ ...get(selected), vertices });
			break;
		}
		execute("addVertex", get(current));
		break;
	case "move": {
		// const origin = get(moves).length > 2
		// 	? get(moves)[get(moves).length - 2]
		// 	: get(presses)[get(presses).length - 1];
		// // const origin = get(presses)[get(presses).length - 1];
		// const end = get(current);
		// const vector = subtract2(end, origin);
		// // move currently selected vertices
		// translateVertices(selected.vertices(), vector);
	}
		break;
	case "release":
		const origin = get(presses)[0];
		const end = get(current);
		if (!origin || !end) { break; }
		// move currently selected vertices
		execute("translateVertices", selected.vertices(), subtract2(end, origin));
		presses.set([]);
		moves.set([]);
		releases.set([]);
		// selected.reset();
		break;
	}
};