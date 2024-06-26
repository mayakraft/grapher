import { boundingBox } from "rabbit-ear/math/polygon.js";
import { writable, derived } from "svelte/store";
import {
	snapOldToPoint,
	snapOldToPointWithInfo,
	snapOldToRulerLine,
} from "../../js/snapOld.js";
import { Keyboard, SnapPoint } from "../../stores/UI.js";
import { RadialSnapDegrees, RadialSnapOffset } from "../../stores/Snap.js";

export const Move = writable(undefined);
export const Press = writable(undefined);
export const Drag = writable(undefined);
export const Release = writable(undefined);

const MoveSnap = derived(Move, ($Move) => snapOldToPointWithInfo($Move), {
	coords: undefined,
	snap: false,
});

const DragSnap = derived(Drag, ($Drag) => snapOldToPointWithInfo($Drag), {
	coords: undefined,
	snap: false,
});

export const MoveCoords = derived(
	MoveSnap,
	($MoveSnap) => $MoveSnap.coords,
	undefined,
);

export const PressCoords = derived(
	Press,
	($Press) => snapOldToPoint($Press),
	undefined,
);

export const DragCoords = derived(
	[Keyboard, Drag],
	([$Keyboard, $Drag]) =>
		$Keyboard[16] // shift key
			? snapOldToRulerLine($Drag).coords
			: snapOldToPoint($Drag),
	undefined,
);

export const SetSnapPoint = derived(
	[MoveSnap, DragSnap],
	([$MoveSnap, $DragSnap]) => {
		const point = [$MoveSnap, $DragSnap].filter((a) => a !== undefined).shift();
		SnapPoint.set(point.snap ? point.coords : undefined);
	},
	undefined,
);

export const DrawRect = derived(
	[PressCoords, DragCoords, Release],
	([$PressCoords, $DragCoords, $Release]) =>
		boundingBox(
			[$PressCoords, $DragCoords, $Release].filter((a) => a !== undefined),
		),
	undefined,
);

export const reset = () => {
	Move.set(undefined);
	Press.set(undefined);
	Drag.set(undefined);
};

let unsub1;

export const subscribe = () => {
	unsub1 = SetSnapPoint.subscribe(() => {});
};

export const unsubscribe = () => {
	if (unsub1) {
		unsub1();
	}
	reset();
};
