<script>
	import { db, library } from "../logic/db";
	import SongList from "../components/SongList.svelte";
	import AlbumList from "../components/AlbumList.svelte";
	let search = "";
	let foundSongs = [];
	let foundAlbums = [];
	function contains(str, substr) {
		return str.toLowerCase().indexOf(substr.toLowerCase()) !== -1;
	}
	$: (async (search, _) => {
		if (search) {
			foundSongs = await db.library
				.filter(
					(song) =>
						contains(song.title, search) || contains(song.artist, search)
				)
				.toArray();
			foundAlbums = await db.albums
				.filter(
					(album) =>
						contains(album.album, search) || contains(album.artist, search)
				)
				.toArray();
		} else {
			foundSongs = [];
			foundAlbums = [];
		}
	})(search, $library);
	$: console.log(foundSongs);
</script>

<div>
	<input
		class="searchBox"
		type="text"
		bind:value={search}
		placeholder="Find something"
		autofocus
	/>
	{#if search}
		{#if foundAlbums.length}
			<h2>Albums</h2>
			<AlbumList maxItems={4} list={foundAlbums || []} />
		{/if}
		{#if foundSongs.length}
			<h2>Songs</h2>
			<SongList maxItems={100} list={foundSongs || []} />
		{/if}
	{/if}
</div>

<style>
	.searchBox {
		width: 100%;
		background: transparent;
		font-size: 2em;
		height: unset;
		/* margin-bottom: 24px; */
	}
</style>
