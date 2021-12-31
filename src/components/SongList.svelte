<script>
	import Song from "./Song.svelte";
	import IconButton from "./IconButton.svelte";
	export let list = [];
	export let startOffset = 0;
	let maxSongs = 100;
	let interval = maxSongs;
	let startIndex = 0;
	let offsetList = [];
	$: offsetList = list.slice(startOffset);
</script>

<div class="songList">
	{#if offsetList.length > maxSongs}
		<div class="songListControls">
			<p>
				{startIndex + 1}-{Math.min(startIndex + maxSongs, offsetList.length)} of
				{offsetList.length}
			</p>
			<IconButton
				icon="arrow_back"
				on:click={(_) => {
					startIndex = Math.max(0, startIndex - interval);
				}}
			/>
			<IconButton
				icon="arrow_forward"
				on:click={(_) => {
					if (startIndex + maxSongs < offsetList.length) {
						startIndex += interval;
					}
				}}
			/>
		</div>
	{/if}
	<div class="songs">
		{#each (offsetList || []).slice(startIndex, startIndex + maxSongs) as song, index}
			<!-- {#if index + startIndex >= startOffset} -->
			<Song {list} index={index + startIndex + startOffset} {song} />
			<!-- {/if} -->
		{/each}
	</div>
</div>

<style lang="scss">
	.songList {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: var(--pad);
	}
	.songListControls {
		display: flex;
		width: 100%;
		justify-content: right;
		align-items: center;
		gap: calc(var(--pad) * 0.5);
		> * {
			margin: 0;
		}
	}
	.songs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr));
		width: 100%;
	}
</style>
