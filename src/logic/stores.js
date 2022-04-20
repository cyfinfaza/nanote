import { writable, get } from "svelte/store";
import { servers } from "./db";
import { authString } from "./utils";

export const playing = writable({});
export const playState = writable({ playing: false, zeroTs: Infinity });
export const queue = writable([]);
export const queueIndex = writable(0);

export const library = writable([]);

export const loading = writable({ initialDomLoad: "Loading..." });

loading.subscribe(next => {
	const actuallyLoading = Object.values(next).filter(entry => entry);
	if (actuallyLoading.length) {
		document.querySelector("body > .loadingPanel > .loadingMessage").innerText =
			actuallyLoading[0];
		document.body.classList.add("loading");
	} else {
		document.body.classList.remove("loading");
	}
});

export const browserHistory = writable([
	{ view: "home", title: "Library", props: [] },
]);
export const browserHistoryIndex = writable(0);
export const currentPanel = writable("browser");

export function browse(view, title, props) {
	const newPage = { view, title, props };
	if (
		JSON.stringify(get(browserHistory)[get(browserHistoryIndex)]) !==
		JSON.stringify(newPage)
	) {
		browserHistory.update(history => [
			...history.slice(0, get(browserHistoryIndex) + 1),
			newPage,
		]);
		browserHistoryIndex.update(index => index + 1);
	}
	currentPanel.set("browser");
}

let _servers;
servers.subscribe(servers => (_servers = servers));

playing.subscribe(next => {
	console.log("playing", next);
	if (next) {
		console.log("updating mediaSession");
		console.log(
			next.server + next.coverUrl + "?auth=" + authString(_servers, next)
		);
		console.log(_servers);
		navigator.mediaSession.metadata = new MediaMetadata({
			title: next.title || "",
			artist: next.artist || "",
			album: next.album || "",
			artwork: [
				{
					src: next.coverUrl
						? next.server +
						  next.coverUrl +
						  "?auth=" +
						  authString(_servers, next)
						: "",
				},
			],
		});
	}
	navigator.mediaSession.setActionHandler(
		"nexttrack",
		get(queueIndex) < get(queue).length - 1
			? _ => {
					console.log("next track");
					queueIndex.update(index => index + 1);
			  }
			: null
	);
	navigator.mediaSession.setActionHandler(
		"previoustrack",
		get(queueIndex) > 0
			? _ => {
					console.log("previous track");
					queueIndex.update(index => index - 1);
			  }
			: null
	);
});
