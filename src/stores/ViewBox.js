import { get, writable, derived } from "svelte/store";
import {
	identity2x3,
	invertMatrix2,
	multiplyMatrices2,
	multiplyMatrix2Vector2,
} from "rabbit-ear/math/algebra/matrix2.js";
import { boundingBox } from "rabbit-ear/graph/boundary.js";
import { Graph } from "./Graph.js";


export const ModelMatrix = derived(
	Graph,
	($Graph) => {
		const box = boundingBox($Graph);
		if (!box || !box.span || !box.min) {
			return [...identity2x3];
		}
		if (!isFinite(box.min[0]) || !isFinite(box.min[1])
			|| !isFinite(box.span[0]) || !isFinite(box.span[1])) {
			return [...identity2x3];
		}
		const vmax = Math.max(box.span[0], box.span[1]);
		console.log("model matrix", [vmax, 0, 0, vmax, box.min[0], box.min[1]]);
		return [vmax, 0, 0, vmax, box.min[0], box.min[1]];
	},
	[...identity2x3],
);

// export const ModelMatrix = writable([...identity2x3]);
// ModelMatrix.reset = () => {
// 	const box = boundingBox(get(Graph));
// 	if (!box || !box.span || !isFinite(box.span[0]) || !isFinite(box.span[1])) {
// 		ModelMatrix.set([...identity2x3]);
// 	}
// 	const vmax = Math.max(box.span[0], box.span[1]);
// 	console.log("model matrix", [vmax, 0, 0, vmax, box.min[0], box.min[1]]);
// 	ModelMatrix.set([vmax, 0, 0, vmax, box.min[0], box.min[1]]);
// };


export const CameraMatrix = writable([...identity2x3]);
CameraMatrix.reset = () => CameraMatrix.set([...identity2x3]);

export const ViewMatrix = derived(
	CameraMatrix,
	($CameraMatrix) => invertMatrix2($CameraMatrix),
	[...identity2x3],
);

export const ModelViewMatrix = derived(
	[ModelMatrix, ViewMatrix],
	([$ModelMatrix, $ViewMatrix]) => multiplyMatrices2($ViewMatrix, $ModelMatrix),
	[...identity2x3],
);

export const ViewBox = derived(
	ModelViewMatrix,
	($ModelViewMatrix) => {
		const m = [...$ModelViewMatrix];
		// get the translation component
		const [, , , , x, y] = m;
		// remove the translation component
		m[4] = m[5] = 0;
		// multiply by unit basis vectors
		const [w, h] = multiplyMatrix2Vector2(m, [1, 1]);
		return [x, y, w, h];
	},
	[0, 0, 1, 1],
);
