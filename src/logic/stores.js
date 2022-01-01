import { writable, get } from "svelte/store";

export const playing = writable({});
export const playState = writable({ playing: false, zeroTs: Infinity });
export const queue = writable([]);
export const queueIndex = writable(0);

export const library = writable([]);

export const loading = writable({ initialDomLoad: "Loading..." });

loading.subscribe((next) => {
	const actuallyLoading = Object.values(next).filter((entry) => entry);
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
export function browse(view, title, props) {
	const newPage = { view, title, props };
	if (
		JSON.stringify(get(browserHistory)[get(browserHistoryIndex)]) !==
		JSON.stringify(newPage)
	) {
		browserHistory.update((history) => [
			...history.slice(0, get(browserHistoryIndex) + 1),
			newPage,
		]);
		browserHistoryIndex.update((index) => index + 1);
	}
}
