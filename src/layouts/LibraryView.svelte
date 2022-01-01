<script>
	import SongList from "../components/SongList.svelte";
	import AlbumList from "../components/AlbumList.svelte";
	import { library, albums } from "../logic/db.js";
	// import { albumsFrom, artistsFrom } from "../logic/utils";
	let showing = "Songs";
</script>

<div>
	<div class="collectionTypes">
		{#each ["Songs", "Albums"] as heading}
			<h1
				class:activeHeading={showing == heading}
				on:click={(_) => (showing = heading)}
				tabindex="0"
			>
				{heading}
			</h1>
		{/each}
	</div>
	{#if showing == "Songs"}
		<SongList list={$library} />
	{:else if showing == "Albums"}
		<AlbumList list={$albums} />
	{/if}
</div>

<style lang="scss">
	.collectionTypes {
		display: flex;
		gap: 8px;
		> * {
			color: var(--fg-hover);
			user-select: none;
			cursor: pointer;
			transition: 120ms;
			&:not(.activeHeading) {
				&:hover {
					color: var(--fg-light);
				}
			}
			&:active {
				filter: contrast(0.8);
				transform: translateY(1px);
			}
		}
	}
	.activeHeading {
		color: var(--text);
	}
</style>
