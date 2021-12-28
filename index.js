import App from "./src/App.svelte";
import { loading } from "./src/logic/stores";

let app = new App({
	target: document.getElementById("main"),
});

window.addEventListener("load", (event) => {
	console.log("DOM fully loaded and parsed");
	loading.update((state) => ({ ...state, initialDomLoad: null }));
});

export default app;
