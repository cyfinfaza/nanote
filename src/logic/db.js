import Dexie from "dexie";
import { liveQuery } from "dexie";
import { writable } from "svelte/store";
import { loading } from "./stores";

export const db = new Dexie("nanote");
db.version(1).stores({
	library: "[server+mediaUrl], title, artist, album, genre, year",
	servers: "[url+profile], key",
});
db.version(2).stores({
	library: "[server+mediaUrl], title, artist, album, year",
	albums: "[album+artist+year], coverUrl, server, profile, folder",
	artists: "[artist]",
	servers: "[url+profile]",
});
export const servers = liveQuery(async (_) => {
	return (await db.servers.toArray()).map((server) => ({
		...server,
		authString: btoa(server.profile + ":" + server.key),
	}));
});
export const library = liveQuery(async (_) => {
	return await db.library.toArray();
});
export const albums = liveQuery(async (_) => {
	return await db.albums.toArray();
});
export const artists = liveQuery(async (_) => {
	return await db.artists.toArray();
});

async function reloadLibrary() {
	loading.update((state) => ({
		...state,
		reloadLibrary: "Refreshing libraries...",
	}));
	let servers = await db.servers.toArray();
	let library = [];
	for (let server of servers) {
		let authHeaders = new Headers();
		authHeaders.append(
			"Authorization",
			`Basic ${btoa(server.profile + ":" + server.key)}`
		);
		let libraryFromServer = await fetch(server.url + "/library", {
			headers: authHeaders,
		}).then((response) => response.json());
		library = library.concat(
			libraryFromServer.map((song) => ({
				...song,
				server: server.url,
				profile: server.profile,
			}))
		);
	}
	await updateDbList(
		db.library,
		library,
		(item) => [item.server, item.mediaUrl],
		(a, b) => a.server == b.server && a.mediaUrl == b.mediaUrl
	);
	await updateDbList(
		db.albums,
		albumsFrom(library),
		(item) => item.id,
		(a, b) => a.album == b.album && a.artist == b.artist && a.year == b.year
	);
	await updateDbList(
		db.artists,
		artistsFrom(library),
		(item) => item.id,
		(a, b) => a.artist == b.artist
	);
	loading.update((state) => ({ ...state, reloadLibrary: null }));
}

servers.subscribe((_) => reloadLibrary());

async function updateDbList(dbList, list, primaryKeysFn, matchFn) {
	let toDelete = [];
	await dbList.each(async (item) => {
		if (!list.find((s) => matchFn(s, item))) {
			toDelete.push(primaryKeysFn(item));
		}
	});
	await dbList.bulkDelete(toDelete);
	await dbList.bulkPut(list);
}

function albumsFrom(songList) {
	let albums = [];
	for (let song of songList) {
		let album = {
			album: song.album,
			artist: song.artist.split(/feat\.|;/g)[0].trim(),
			year: song.year,
			coverUrl: song.coverUrl,
			server: song.server,
			profile: song.profile,
			folder: song.mediaUrl.split("/").slice(0, -1).join("/"),
			tracks: [[song.server, song.mediaUrl]],
		};
		// console.log(album.folder);
		let foundAlbum = albums.findIndex(
			(a) =>
				((a.coverUrl == album.coverUrl || a.folder == album.folder) &&
					a.album == album.album &&
					a.year == album.year) ||
				(a.album == album.album &&
					a.artist == album.artist &&
					a.year == album.year)
		);
		if (foundAlbum > -1) {
			albums[foundAlbum].tracks.push(...album.tracks);
		} else {
			albums.push(album);
		}
	}
	console.log(albums);
	return albums;
}

export function artistsFrom(songList) {
	let artists = [];
	for (let song of songList) {
		if (!artists.find((a) => a == song.artist)) {
			artists.push(song.artist);
		}
	}
	return artists.map((artist) => ({ artist }));
}
