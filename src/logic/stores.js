import { writable } from "svelte/store";

export const playing = writable({});
export const playState = writable({});
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
