<script>
	export let album;
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
	{#if album.coverUrl && authString($servers, album)}
		<img
			src={album.server +
				album.coverUrl +
				"?auth=" +
				authString($servers, album)}
			alt=""
			loading="lazy"
			class="albumCover"
		/>
	{:else}
		<img src="album.svg" alt="" class="albumCover" />
	{/if}
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
		z-index: 1;
	}
</style>
