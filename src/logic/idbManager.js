import { library } from "./stores";

const indexedDB =
	window.indexedDB ||
	window.mozIndexedDB ||
	window.webkitIndexedDB ||
	window.msIndexedDB;

let request = indexedDB.open("nanote", 1);
export let libraryDB;
export let serversDB;

export function waitForDB() {
	return new Promise((resolve, reject) => {
		if (libraryDB && serversDB) {
			resolve({ libraryDB, serversDB });
		} else {
			request.addEventListener(
				"success",

				function (event) {
					console.log("idb success", event);
					// libraryDB = event.target.result.transaction("library", "readwrite");
					// libraryDB = event.target.result.transaction("library", "readwrite");
					let transaction = event.target.result.transaction(
						["library", "servers"],
						"readwrite"
					);
					resolve({
						libraryDB: transaction.objectStore("library"),
						serversDB: transaction.objectStore("servers"),
					});
				}
			);
			request.addEventListener("error", function (event) {
				reject(event);
			});
		}
	});
}

request.addEventListener("error", function (event) {
	console.error("idb error: ", event);
});
request.addEventListener(
	"success",

	function (event) {
		console.log("idb success", event);
		libraryDB = event.target.result.transaction("servers", "readwrite");
		serversDB = event.target.result.transaction("library", "readwrite");
	}
);

request.onupgradeneeded = function (event) {
	console.log("idb upgrade needed");
	let db = event.target.result;
	let os = db.createObjectStore("library", { autoincrement: true });
	os.createIndex("title", "title", { unique: false });
	os.createIndex("artist", "artist", { unique: false });
	os.createIndex("album", "album", { unique: false });
	os.createIndex("genre", "genre", { unique: false });
	os.createIndex("year", "year", { unique: false });
	os.createIndex("server", "server", { unique: false });
	let serversOS = db.createObjectStore("servers", { autoincrement: true });
};
