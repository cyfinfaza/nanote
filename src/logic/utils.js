import { writable } from "svelte/store";

export const authString = (server, song) =>
	(server || []).find(s => s.url == song?.server && s.profile == song?.profile)
		?.authString;

export function persistent(key, def) {
	let store = writable(localStorage.getItem(key) || def);
	store.subscribe(next => {
		localStorage.setItem(key, next);
	});
	return store;
}

export function arrayShuffle(arr) {
	let i = arr.length;
	while (i) {
		let j = Math.floor(Math.random() * i--);
		[arr[j], arr[i]] = [arr[i], arr[j]];
	}
	return arr;
}
