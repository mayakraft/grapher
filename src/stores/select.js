import { get } from "svelte/store";
import { writable } from "svelte/store";

export const emptySelectObject = () => (
	{ vertices: [], edges: [], faces: [] }
);

export const selectionRect = writable(undefined);

const {
	subscribe: subscribeSelected,
	set: setSelected,
} = writable(emptySelectObject());

export const selected = {
	subscribe: subscribeSelected,
	set: (g) => setSelected(g),
	edges: () => {
		const value = get(selected).edges || [];
		return Object.keys(value)
			.map(key => value[key] ? key : undefined)
			.filter(a => a !== undefined)
			.map(n => parseInt(n, 10));
	},
	reset: () => setSelected(emptySelectObject()),
};
