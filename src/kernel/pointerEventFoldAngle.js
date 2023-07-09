import { nearest } from "rabbit-ear/graph/nearest.js";
import {
	distance2,
	subtract2,
} from "rabbit-ear/math/algebra/vector.js";
import { get } from "svelte/store";
import { selection } from "../stores/select.js";
import {
	ASSIGN_SWAP,
	ASSIGN_FLAT,
	ASSIGN_UNASSIGNED,
	ASSIGN_CUT,
	ASSIGN_BOUNDARY,
} from "../app/keys.js";
import {
	graph,
} from "../stores/graph.js";
import { assignType } from "../stores/tool.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";
import { execute } from "./app.js";

const setFoldAngle = (edge) => {

};

export const pointerEventFoldAngle = (eventType) => {
	switch (eventType) {
	case "press":
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		setFoldAngle(edge);
		break;
	case "hover": {
		const edge = nearest(get(graph), get(current)).edge;
		if (edge === undefined) { break; }
		selection.reset();
		selection.addEdges([edge]);
	}
		break;
	case "move":
		break;
	case "release":
		break;
	}
};