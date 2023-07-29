import { get } from "svelte/store";
import {
	doAxiom1,
	doAxiom2,
	doAxiom3,
	doAxiom4,
	doAxiom5,
	doAxiom6,
	doAxiom7,
} from "../js/axioms.js";
import removeGeometry from "rabbit-ear/graph/remove.js";
import Planarize from "rabbit-ear/graph/planarize.js";
import AddVertex from "rabbit-ear/graph/add/addVertex.js";
import addNonPlanarEdge from "rabbit-ear/graph/add/addNonPlanarEdge.js";
import splitEdge from "rabbit-ear/graph/splitEdge/index.js";
import populate from "rabbit-ear/graph/populate.js";
import { kawasakiSolutions } from "rabbit-ear/singleVertex/kawasakiGraph.js";
import { add2 } from "rabbit-ear/math/algebra/vector.js";
import { pleat as fnPleat } from "rabbit-ear/graph/pleat.js";
import { pointsToLine } from "rabbit-ear/math/general/convert.js";
import { downloadFile } from "../js/file.js";
import { Graph } from "../stores/Graph.js";
import { Selection } from "../stores/Select.js";
import {
	RulerLines,
	RulerRays,
	RulerLinePreviews,
	RulerRayPreviews,
} from "../stores/Ruler.js";
import { NewEdgeAssignment } from "../stores/App.js";
import { doSetEdgesAssignment } from "../js/assignments.js";
/**
 *
 */
export const test = (...args) => console.log(["test():"]
	.concat(args.map((arg, i) => `${i}:${typeof arg}:${JSON.stringify(arg)}`))
	.map(s => `${s}\n`)
	.join(""));
/**
 *
 */
export const clearSelection = () => Selection.reset();
/**
 *
 */
export const addToSelection = (component = "vertices", components = []) => {
	switch (component) {
	case "vertices": return Selection.addVertices(components);
	case "edges": return Selection.addEdges(components);
	case "faces": return Selection.addFaces(components);
	}
};

const deleteComponentsFromGraph = (graph, remove) => {
	// add each vertex's adjacent edges to the delete list
	if (graph.vertices_edges) {
		remove.vertices
			.flatMap((del, v) => del ? graph.vertices_edges[v] : [])
			.forEach(e => { remove.edges[e] = true; });
	}
	// add each vertex's adjacent faces to the delete list
	if (graph.vertices_faces) {
		remove.vertices
			.flatMap((del, v) => del ? graph.vertices_faces[v] : [])
			.forEach(f => { remove.faces[f] = true; });
	}
	// convert object into array of indices. these will be sorted.
	const truthy = (arr) => arr
		.map((del, i) => del ? i : undefined)
		.filter(i => i !== undefined);
	// remove
	["vertices", "edges", "faces"]
		.forEach(key => removeGeometry(graph, key, truthy(remove[key])));
	return graph;
};
/**
 *
 */
export const deleteComponents = (components) => {
	const remove = { vertices: [], edges: [], faces: [] };
	components.vertices.forEach(v => { remove.vertices[v] = true; });
	components.edges.forEach(v => { remove.edges[v] = true; });
	components.faces.forEach(v => { remove.faces[v] = true; });
	const g = deleteComponentsFromGraph(get(Graph), remove);
	Graph.set({ ...g });
};

export const snapAllVertices = () => {
	const vertices_coords = get(Graph).vertices_coords || [];
	vertices_coords.forEach((coord, i) => coord.forEach((n, j) => {
		vertices_coords[i][j] = Math.round(n);
	}));
	Graph.set({ ...get(Graph), vertices_coords });
};

export const addVertex = (coords) => {
	const g = get(Graph);
	const newestVertex = AddVertex(g, coords);
	Graph.set({ ...g });
	Selection.reset();
	Selection.addVertices([newestVertex]);
	return newestVertex;
};

export const addEdge = (vertexA, vertexB) => {
	const g = get(Graph);
	const newestEdge = addNonPlanarEdge(g, [vertexA, vertexB]);
	doSetEdgesAssignment(g, [newestEdge], get(NewEdgeAssignment));
	Graph.set({ ...g });
	Selection.reset();
	Selection.addEdges([newestEdge]);
	return newestEdge;
};

export const splitEdges = (edges) => {
	const g = get(Graph);
	const result = edges
		.slice()
		.sort((a, b) => b - a)
		.map(edge => splitEdge(g, edge));
	Graph.set({ ...g });
};

export const translateVertices = (vertices, vector) => {
	const vertices_coords = get(Graph).vertices_coords || [];
	vertices.forEach(v => {
		vertices_coords[v] = add2(vertices_coords[v], vector);
	});
	Graph.simpleSet({ ...get(Graph), vertices_coords });
};

export const setEdgesAssignment = (edges, assignment, foldAngle) => {
	const graph = get(Graph);
	doSetEdgesAssignment(graph, edges, assignment, foldAngle);
	Graph.simpleSet({ ...graph });
};

export const setEdgesFoldAngle = (edges, foldAngle) => {
	const graph = get(Graph);
	doSetEdgesFoldAngle(graph, edges, foldAngle);
	Graph.simpleSet({ ...graph });
};

export const planarize = () => (
	Graph.set(populate(Planarize(get(Graph)), true))
);

export const load = (FOLD) => Graph.load(populate(FOLD));

export const clear = () => Graph.reset();

export const download = (filename) => (
	downloadFile(JSON.stringify(get(Graph)), filename)
);

export const axiom1 = (...args) => (
	RulerLines.add(doAxiom1(get(Graph), ...args))
);
export const axiom2 = (...args) => (
	RulerLines.add(doAxiom2(get(Graph), ...args))
);
export const axiom3 = (...args) => (
	RulerLines.add(doAxiom3(get(Graph), ...args))
);
export const axiom4 = (...args) => (
	RulerLines.add(doAxiom4(get(Graph), ...args))
);
export const axiom5 = (...args) => (
	RulerLines.add(doAxiom5(get(Graph), ...args))
);
export const axiom6 = (...args) => (
	RulerLines.add(doAxiom6(get(Graph), ...args))
);
export const axiom7 = (...args) => (
	RulerLines.add(doAxiom7(get(Graph), ...args))
);

export const axiom1Preview = (...args) => (
	RulerLinePreviews.set(doAxiom1(get(Graph), ...args))
);
export const axiom2Preview = (...args) => (
	RulerLinePreviews.set(doAxiom2(get(Graph), ...args))
);
export const axiom3Preview = (...args) => (
	RulerLinePreviews.set(doAxiom3(get(Graph), ...args))
);
export const axiom4Preview = (...args) => (
	RulerLinePreviews.set(doAxiom4(get(Graph), ...args))
);
export const axiom5Preview = (...args) => (
	RulerLinePreviews.set(doAxiom5(get(Graph), ...args))
);
export const axiom6Preview = (...args) => (
	RulerLinePreviews.set(doAxiom6(get(Graph), ...args))
);
export const axiom7Preview = (...args) => (
	RulerLinePreviews.set(doAxiom7(get(Graph), ...args))
);

const doPleat = (edgeA, edgeB, count) => {
	if (edgeA === undefined || edgeB === undefined) { return []; }
	const result = fnPleat(get(Graph), edgeA, edgeB, count);
	return result.flat();
};

export const pleat = (...args) => RulerLines.add(doPleat(...args));
export const pleatPreview = (...args) => (
	RulerLinePreviews.add(doPleat(...args))
);
export const kawasakiRulerPreviews = (vertex) => {
	const graph = get(Graph);
	const origin = graph.vertices_coords[vertex];
	const rays = kawasakiSolutions(graph, vertex)
		.filter(a => a !== undefined)
		.map(vector => ({ origin, vector }));
	RulerRayPreviews.set(rays);
};

export const kawasakiRulers = (vertex) => {
	const graph = get(Graph);
	const origin = graph.vertices_coords[vertex];
	const rays = kawasakiSolutions(graph, vertex)
		.filter(a => a !== undefined)
		.map(vector => ({ origin, vector }));
	RulerRays.set(rays);
};
