import { assignmentFlatFoldAngle } from "rabbit-ear/fold/spec.js";

export const doSetEdgesAssignment = (graph, edges, assignment, foldAngle) => {
	// ensure edges_assignment and edges_foldAngle exist
	if (!graph.edges_vertices) { return; }
	if (!graph.edges_assignment) {
		graph.edges_assignment = graph.edges_vertices.map(() => "U");
	}
	if (!graph.edges_foldAngle) {
		graph.edges_foldAngle = graph.edges_vertices.map(() => 0);
	}
	// set data
	edges.forEach(e => { graph.edges_assignment[e] = assignment; });
	if (foldAngle === undefined) {
		foldAngle = assignmentFlatFoldAngle[assignment] || 0;
	}
	edges.forEach(e => { graph.edges_foldAngle[e] = foldAngle; });
};

const signedAssignments = { M: -1, m: -1, V: 1, v: 1 };

export const doSetEdgesFoldAngle = (g, edges, foldAngle) => {
	// ensure edges_foldAngle exist
	if (!g.edges_vertices) { return; }
	if (!g.edges_foldAngle) {
		g.edges_foldAngle = g.edges_vertices.map(() => 0);
	}
	// if edges_assignment exists, use it to ensure sign is correct
	// (M is - and V is +, anything else don't touch).
	if (g.edges_assignment) {
		edges.forEach(e => {
			// if the assignment is M or V, and
			// the foldAngle sign doesn't match, flip it
			if (g.edges_assignment[e] in signedAssignments
				&& Math.sign(foldAngle) !== signedAssignments[g.edges_assignment[e]]) {
				g.edges_foldAngle[e] = -foldAngle;
			} else {
				g.edges_foldAngle[e] = foldAngle;
			}
		});
	} else {
		edges.forEach(e => { g.edges_foldAngle[e] = foldAngle; });
	}
	return g;
};
