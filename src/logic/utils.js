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

export function albumsFrom(songList) {
	let albums = [];
	for (let song of songList) {
		let album = {
			album: song.album,
			artist: song.artist,
			year: song.year,
		};
		if (
			!albums.find(
				(a) =>
					a.title == album.title &&
					a.artist == album.artist &&
					a.year == album.year
			)
		) {
			albums.push(album);
		}
	}
	return albums;
}

export function artistsFrom(songList) {
	let artists = [];
	for (let song of songList) {
		if (!artists.find((a) => a == song.artist)) {
			artists.push(song.artist);
		}
	}
	return artists;
}
