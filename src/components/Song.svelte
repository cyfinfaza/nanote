<script>
	export let song;
	export let list;
	export let index;
	import { onMount } from "svelte";
	import CoverImage from "./CoverImage.svelte";
	// if (list && index) {
	// 	song = list[index];
	// }
	// $: if (list && index) {
	// 	song = list[index];
	// }
	export let disabled = false;
	import { servers } from "../logic/db";
	import { playing, queue, queueIndex } from "../logic/stores";
	import { authString } from "../logic/utils";
	let isPlaying = false;
	$: $playing &&
		(isPlaying =
			$playing.server == song.server && $playing.mediaUrl == song.mediaUrl);
	function playSong() {
		$queue = [...list];
		$queueIndex = index;
	}
	let songImage;
	onMount((_) => {
		console.log("song mounted");
	});
	let loaded = false;
	$: {
		song;
		loaded = false;
	}
</script>

<div
	class="song"
	class:playing={isPlaying}
	class:disabled
	on:click={!disabled && playSong}
>
	<span class="material-icons playIndicator"
		>{#if isPlaying}
			equalizer
		{:else}
			play_arrow
		{/if}</span
	>
	<div class="albumCover">
		<CoverImage item={song} />
	</div>
	<div class="songName">
		<h3>{song.title}</h3>
		<p>
			{song.artist} &bull; {song.album}
			{#if song.year} &bull; {song.year}{/if}
		</p>
	</div>
</div>

<style lang="scss">
	.song {
		display: flex;
		height: 72px;
		overflow: hidden;
		align-items: center;
		// gap: 12px;
		padding: 8px;
		width: 100%;
		box-sizing: border-box;
		--transition: 120ms;
		transition: var(--transition);
		border-radius: 12px;
		&:hover:not(.disabled) {
			background: var(--fg);
			cursor: pointer;
		}
		&:hover:not(.disabled),
		&.playing {
			.playIndicator {
				width: 24px;
				opacity: 1;
				transform: scale(1);
				margin-right: 12px;
			}
		}
		> * {
			margin-right: 12px;
		}
	}
	.playIndicator {
		width: 0;
		opacity: 0;
		transform: scale(0.5);
		transition: var(--transition);
		margin-right: 0;
		z-index: 0;
	}
	.songName {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		flex: 1;
		overflow: hidden;
		> * {
			margin: 0;
			text-overflow: ellipsis;
			overflow: hidden;
			white-space: nowrap;
		}
	}
	.albumCover {
		grid-row: 1 / 3;
		height: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		border-radius: 4px;
		overflow: hidden;
		z-index: 1;
	}
</style>
