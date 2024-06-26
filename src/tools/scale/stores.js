import { writable, derived } from "svelte/store";
import { add2, subtract2, magnitude2 } from "rabbit-ear/math/vector.js";
import { subgraph } from "rabbit-ear/graph/subgraph.js";
import { normalize } from "rabbit-ear/graph/normalize.js";
import { snapOldToPoint, snapOldToRulerLine } from "../../js/snapOld.js";
import { Keyboard, GhostGraphCP } from "../../stores/UI.js";
import { Selection } from "../../stores/Select.js";
import { CreasePattern } from "../../stores/ModelCP.js";
import { RadialSnapDegrees, RadialSnapOffset } from "../../stores/Snap.js";
import { RulersCP, RulersFolded, RadialRays } from "../../stores/Ruler.js";
import { executeCommand } from "../../kernel/execute.js";

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);
export const Release = writable(undefined);

export const MoveCoords = derived(
	Move,
	($Move) => snapOldToPoint($Move),
	undefined,
);

export const PressCoords = derived(
	Press,
	($Press) => snapOldToPoint($Press),
	undefined,
);

export const ReleaseCoords = derived(Release, ($Release) =>
	snapOldToPoint($Release),
);

export const DragCoords = derived(
	[Keyboard, Drag],
	([$Keyboard, $Drag]) =>
		$Keyboard[16] // shift key
			? snapOldToRulerLine($Drag).coords
			: snapOldToPoint($Drag),
	undefined,
);

const ScaleRatio = derived(
	[PressCoords, DragCoords],
	([$PressCoords, $DragCoords]) => {
		if ($PressCoords === undefined || $DragCoords === undefined) {
			return 1;
		}
		const pressLength = magnitude2($PressCoords);
		if (pressLength === 0) {
			return 1;
		}
		const ratio = magnitude2($DragCoords) / pressLength;
		if (isNaN(ratio) || !isFinite(ratio)) {
			return 1;
		}
		return ratio;
	},
	1,
);

export const Subgraph = derived(
	[CreasePattern, Selection],
	([$CreasePattern, $Selection]) => {
		try {
			return subgraph($CreasePattern, $Selection);
		} catch (error) {
			return {};
		}
	},
	{},
);

const GhostGraphCPPreview = derived(
	[Subgraph, ScaleRatio],
	([$Subgraph, $ScaleRatio]) => {
		try {
			const clone = structuredClone($Subgraph);
			if ($ScaleRatio !== undefined) {
				clone.vertices_coords = clone.vertices_coords.map((coords) =>
					coords.map((n) => n * $ScaleRatio),
				);
			}
			GhostGraphCP.set(clone);
		} catch (error) {}
	},
	undefined,
);

export const DoTransform = derived(
	[ScaleRatio, ReleaseCoords],
	([$ScaleRatio, $ReleaseCoords]) => {
		if ($ScaleRatio !== undefined && $ReleaseCoords !== undefined) {
			if (!isNaN($ScaleRatio) && isFinite($ScaleRatio)) {
				executeCommand("scaleUniform", $ScaleRatio);
			}
			reset();
		}
	},
	undefined,
);

export const ShiftRulers = derived(
	[Keyboard, PressCoords, RadialSnapDegrees, RadialSnapOffset],
	([$Keyboard, $PressCoords, $RadialSnapDegrees, $RadialSnapOffset]) => {
		if ($Keyboard[16] && $PressCoords) {
			RulersCP.set(
				RadialRays($PressCoords, $RadialSnapDegrees, $RadialSnapOffset),
			);
		} else {
			RulersCP.set([]);
		}
	},
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Drag.set(undefined);
	Release.set(undefined);
};

let unsub0;
let unsub1;
let unsub2;

export const subscribe = () => {
	unsub0 = ShiftRulers.subscribe(() => {});
	unsub1 = DoTransform.subscribe(() => {});
	unsub2 = GhostGraphCPPreview.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub0) {
		unsub0();
	}
	if (unsub1) {
		unsub1();
	}
	if (unsub2) {
		unsub2();
	}
	reset();
};
