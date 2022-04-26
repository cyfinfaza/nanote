<script>
	import { authString } from "../logic/utils";
	import { servers } from "../logic/db";
	export let item;
	let loaded = false;
	let lastCoverUrl;
	$: {
		if (item.coverUrl != lastCoverUrl) {
			loaded = false;
		}
		lastCoverUrl = item.coverUrl;
	}
	let coverImage;
	setInterval(() => {
		if (coverImage && coverImage.complete) {
			loaded = true;
		}
	}, 1000);
</script>

{#if item.coverUrl && authString($servers, item)}
	<img
		src={item.server + item.coverUrl + "?auth=" + authString($servers, item)}
		alt=""
		loading="lazy"
		class="albumCover"
		class:hidden={!loaded}
		bind:this={coverImage}
		on:load={(_) => (loaded = true)}
	/>
{:else}
	<img src="album.svg" alt="" class="albumCover default" />
{/if}

<style>
	.albumCover {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transition: 200ms;
	}
	.hidden {
		opacity: 0;
		/* transform: scale(1.1); */
	}
	@keyframes loadIn {
		from {
			opacity: 0;
			/* transform: scale(1.1); */
		}
	}
	.default {
		animation: loadIn 200ms backwards;
	}
</style>
