<script>
	export let song;
	import { servers } from "../logic/db";
	import { playing } from "../logic/stores";
	import { authString } from "./logic/utils";
	function playSong() {
		$playing = song;
	}
</script>

<div class="song" on:click={playSong}>
	<span class="material-icons playIndicator">play_arrow</span>
	{#if song.coverUrl}
		<img
			src={song.server + song.coverUrl + "?auth=" + authString($servers, song)}
			alt=""
			loading="lazy"
			class="albumCover"
		/>
	{:else}
		<img src="album.svg" alt="" class="albumCover" />
	{/if}
	<div class="songName">
		<h3>{song.title}</h3>
		<p>{song.artist} &bull; {song.album} &bull; {song.year}</p>
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
		&:hover {
			background: var(--fg);
			cursor: pointer;
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
		> * {
			margin: 0;
		}
	}
	.albumCover {
		grid-row: 1 / 3;
		height: 100%;
		border-radius: 4px;
		z-index: 1;
	}
</style>
