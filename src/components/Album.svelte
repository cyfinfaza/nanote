<script>
	export let album;
	import CoverImage from "./CoverImage.svelte";
	import { servers } from "../logic/db";
	import { authString } from "../logic/utils";
	import { browse } from "../logic/stores";
	$: console.log(album);
</script>

<div
	class="album"
	on:click={(_) =>
		browse("album", "Album", {
			primaryKey: [album.album, album.artist, album.year],
		})}
>
	<div class="albumCover">
		<CoverImage item={album} />
	</div>
	<div class="albumName">
		<h2>{album.album}</h2>
		<p>
			{album.artist}
			{#if album.year} &bull; {album.year}{/if}
			&bull; {album.tracks.length}
			{#if album.tracks.length == 1}song{:else}songs{/if}
		</p>
	</div>
</div>

<style lang="scss">
	.album {
		display: flex;
		height: 144px;
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
		> * {
			margin-right: 12px;
		}
	}
	.albumName {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: 100%;
		flex: 1;
		overflow: hidden;
		> * {
			margin: 0;
			text-overflow: ellipsis;
			overflow: hidden;
			// white-space: nowrap;
		}
	}
	.albumCover {
		grid-row: 1 / 3;
		height: 100%;
		border-radius: 4px;
		overflow: hidden;
		aspect-ratio: 1;
		z-index: 1;
	}
</style>
