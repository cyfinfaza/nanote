<script>
	import Song from "./Song.svelte";
	import Paginated from "./Paginated.svelte";
	export let list = [];
	export let startOffset = 0;
	export let maxItems = 100;
</script>

<Paginated {list} {startOffset} {maxItems} let:item={song} let:list let:index>
	<Song {list} {song} {index} />
</Paginated>
