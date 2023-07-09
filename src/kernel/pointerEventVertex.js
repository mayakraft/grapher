import { add2, subtract2 } from "rabbit-ear/math/algebra/vector.js";
// import normalize from "rabbit-ear/graph/normalize.js";
import { get } from "svelte/store";
// import { selected } from "../stores/select.js";
import { graph, uiGraph } from "../stores/graph.js";
import {
	presses,
	moves,
	releases,
	current
} from "../stores/ui.js";
import { getSnapPoint } from "../js/nearest.js";
import { subgraphWithVertices, normalize } from "../js/subgraph.js";
import { execute } from "./app.js";

const getDragVector = () => {
	const origin = get(presses)[0];
	const end = get(current);
	if (!origin || !end) { return [0, 0]; }
	return subtract2(end, origin);
};

export const pointerEventVertex = (eventType) => {
	switch (eventType) {
	case "press":
		const { coords, vertex } = getSnapPoint(get(current));
		if (vertex !== undefined) {
			const vertices = [];
			vertices[vertex] = true;
			// selected.set({ ...get(selected), vertices });
			break;
		}
		execute("addVertex", coords);
		break;
	case "move": {
		const dragVector = getDragVector();
		const selVerts = selected.vertices();
		const subgraph = subgraphWithVertices(get(graph), selVerts);
		selVerts.forEach(v => {
			subgraph.vertices_coords[v] = add2(subgraph.vertices_coords[v], dragVector);
		});
		normalize(subgraph);
		uiGraph.set({ ...subgraph });
	}
		break;
	case "release":
		uiGraph.set({});
		// move currently selected vertices
		execute("translateVertices", selected.vertices(), getDragVector());
		presses.set([]);
		moves.set([]);
		releases.set([]);
		// selected.reset();
		break;
	default:
		console.warn("no switch definition for", eventType);
	}
};
