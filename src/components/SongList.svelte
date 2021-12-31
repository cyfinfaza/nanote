<script>
	import Song from "./Song.svelte";
	import Paginated from "./Paginated.svelte";
	export let list = [];
	export let startOffset = 0;
</script>

<Paginated {list} {startOffset} let:item={song} let:list let:index>
	<Song {list} {song} {index} />
</Paginated>
