import Dexie from "dexie";
import { liveQuery } from "dexie";
import { writable } from "svelte/store";
import { loading } from "./stores";

export const db = new Dexie("nanote");
db.version(1).stores({
	library: "[server+mediaUrl], title, artist, album, genre, year",
	servers: "[url+profile], key",
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
	let toDelete = [];
	await db.library.each(async (song) => {
		if (
			!library.find(
				(s) => s.server == song.server && s.mediaUrl == song.mediaUrl
			)
		) {
			toDelete.push([song.server, song.mediaUrl]);
		}
	});
	await db.library.bulkDelete(toDelete);
	await db.library.bulkPut(library);
	loading.update((state) => ({ ...state, reloadLibrary: null }));
}

servers.subscribe((_) => reloadLibrary());
