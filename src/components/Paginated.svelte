<script>
	import IconButton from "./IconButton.svelte";
	export let list = [];
	export let startOffset = 0;
	export let maxItems = 100;
	let interval = maxItems;
	let startIndex = 0;
	let offsetList = [];
	$: offsetList = list.slice(startOffset);
</script>

<div class="itemList">
	{#if offsetList.length > maxItems}
		<div class="itemListControls">
			<p>
				{startIndex + 1}-{Math.min(startIndex + maxItems, offsetList.length)} of
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
					if (startIndex + maxItems < offsetList.length) {
						startIndex += interval;
					}
				}}
			/>
		</div>
	{/if}
	<div class="items">
		{#each (offsetList || []).slice(startIndex, startIndex + maxItems) as item, index}
			<slot {item} {list} index={index + startIndex + startOffset} />
		{/each}
	</div>
</div>

<style lang="scss">
	.itemList {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: var(--pad);
	}
	.itemListControls {
		display: flex;
		width: 100%;
		justify-content: right;
		align-items: center;
		gap: calc(var(--pad) * 0.5);
		> * {
			margin: 0;
		}
	}
	.items {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(400px, 100%), 1fr));
		width: 100%;
	}
</style>
