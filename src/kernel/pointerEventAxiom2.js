import { axiom2 } from "rabbit-ear/axioms/axiomsVecLine.js";
import { get } from "svelte/store";
// import { uiGraph } from "../stores/graph.js";
// import { selected } from "../stores/select.js";
import { selection } from "../stores/select.js";
import {
	current,
	presses,
	moves,
	releases,
} from "../stores/ui.js";
import { getSnapPoint } from "../js/nearest.js";
import { execute } from "./app.js";
import { rulerLines } from "../stores/ruler.js";

let pressCoords = undefined;
let pressVertex = undefined;

let releaseCoords = undefined;
let releaseVertex = undefined;

export const pointerEventAxiom2 = (eventType) => {
	const { coords, vertex } = getSnapPoint(get(current));
	switch (eventType) {
	case "hover": {
		selection.reset();
		selection.addVertices([vertex]);
		// const vertices = [];
		// if (vertex !== undefined) { vertices[vertex] = true; }
		// selected.set({ ...get(selected), vertices });
		// uiGraph.set({ vertices_coords: [coords] });
	}
		break;
	case "press": {
		pressVertex = vertex;
		pressCoords = coords;
		releaseCoords = [...coords];
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			rulerLines.set(result);
		}
		selection.reset();
		selection.addVertices([vertex]);
		// const vertices = [];
		// if (vertex !== undefined) { vertices[vertex] = true; }
		// selected.set({ ...get(selected), vertices });
	}
		break;
	case "move": {
		releaseVertex = vertex;
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			rulerLines.set(result);
		}
		selection.reset();
		selection.addVertices([pressVertex, releaseVertex]
			.filter(a => a !== undefined));
		// const vertices = [];
		// if (pressVertex !== undefined) { vertices[pressVertex] = true; }
		// if (releaseVertex !== undefined) { vertices[releaseVertex] = true; }
		// selected.set({ ...get(selected), vertices });
	}
		break;
	case "release":
		releaseCoords = coords;
		const result = axiom2(pressCoords, releaseCoords);
		if (result) {
			rulerLines.set(result);
		}
		presses.set([]);
		moves.set([]);
		releases.set([]);
		// uiGraph.set({});
		break;
	}
};