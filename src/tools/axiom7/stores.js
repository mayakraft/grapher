import { writable, derived } from "svelte/store";
import {
	snapOldToPoint,
	snapToEdge,
	snapOldToRulerLine,
} from "../../js/snapOld.js";
import { zipArrays } from "../../js/arrays.js";
import { execute } from "../../kernel/execute.js";
import { GuideLinesCP, Highlight } from "../../stores/UI.js";
import { RulersCP } from "../../stores/Ruler.js";

export const Move = writable(undefined);
export const Presses = writable([]);
export const Releases = writable([]);

export const Touches = derived(
	[Move, Presses, Releases],
	([$Move, $Presses, $Releases]) =>
		zipArrays($Presses, $Releases)
			.concat([$Move])
			.filter((a) => a !== undefined),
	[],
);

export const Step = derived(Touches, ($Touches) => $Touches.length, 0);

export const InputPoint = derived(
	Touches,
	($Touches) => snapOldToPoint($Touches[0], false),
	undefined,
);

export const InputEdge0 = derived(
	Touches,
	($Touches) => snapToEdge($Touches[1], false).edge,
	undefined,
);

export const InputEdge1 = derived(
	Touches,
	($Touches) => snapToEdge($Touches[2], false).edge,
	undefined,
);

// Touches[3] skipped

export const Segment0 = derived(
	Touches,
	($Touches) => snapOldToRulerLine($Touches[4], false).coords,
	undefined,
);

export const Segment1 = derived(
	Touches,
	($Touches) => snapOldToRulerLine($Touches[5], false).coords,
	undefined,
);

export const Highlights = derived(
	[InputEdge0, InputEdge1],
	([$InputEdge0, $InputEdge1]) => {
		Highlight.reset();
		const edges = [$InputEdge0, $InputEdge1].filter((a) => a !== undefined);
		Highlight.addEdges(edges);
	},
	undefined,
);

export const AxiomPreview = derived(
	[InputEdge0, InputEdge1, InputPoint],
	([$InputEdge0, $InputEdge1, $InputPoint]) =>
		$InputEdge0 !== undefined &&
		$InputEdge1 !== undefined &&
		$InputPoint !== undefined
			? execute(
					`setGuideLinesCP(axiom7(${$InputEdge0}, ${$InputEdge1}, ${JSON.stringify($InputPoint)}))`,
				)
			: GuideLinesCP.set([]),
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Presses.set([]);
	Releases.set([]);
	RulersCP.set([]);
};

let unsub0;
let unsub1;

export const subscribe = () => {
	unsub0 = AxiomPreview.subscribe(() => {});
	unsub1 = Highlights.subscribe(() => {});
};

export const unsubscribe = () => {
	reset();
	if (unsub0) {
		unsub0();
	}
	if (unsub1) {
		unsub1();
	}
};
