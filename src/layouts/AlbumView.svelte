<script>
	import SongList from "../components/SongList.svelte";
	import { servers } from "../logic/db";
	import { authString } from "../logic/utils";
	import { db } from "../logic/db";
	export let primaryKey;
</script>

<div class="vertiPanel" style="padding: 12px;">
	{#await db.albums.get(primaryKey) then album}
		<div
			class="horizPanel"
			style="align-items: flex-end; gap: 16px; flex-wrap: wrap;"
		>
			{#if album.coverUrl && authString($servers, album)}
				<img
					src={album.server +
						album.coverUrl +
						"?auth=" +
						authString($servers, album)}
					alt=""
					loading="lazy"
					style="width: min(100%, 360px); border-radius: 8px;"
				/>
			{:else}
				<img src="album.svg" alt="" class="albumCover" />
			{/if}
			<div class="vertiPanel" style="flex: 1; min-width: min(360px, 100%)">
				<h1>{album.album}</h1>
				<p>
					{album.artist}
					{#if album.year} &bull; {album.year}{/if}
					&bull; {album.tracks.length}
					{#if album.tracks.length == 1}song{:else}songs{/if}
				</p>
			</div>
			{#await db.library.bulkGet(album.tracks) then songs}
				<SongList list={songs} />
			{/await}
		</div>
	{/await}
</div>

<style>
	.album {
		display: flex;
		flex-direction: column;
		gap: var(--pad);
	}
</style>
