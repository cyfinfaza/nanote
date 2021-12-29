import { writable } from "svelte/store";

export const authString = (server, song) =>
	(server || []).find(
		(s) => s.url == song?.server && s.profile == song?.profile
	)?.authString;

export function persistent(key, def) {
	let store = writable(localStorage.getItem(key) || def);
	store.subscribe((next) => {
		localStorage.setItem(key, next);
	});
	return store;
}
