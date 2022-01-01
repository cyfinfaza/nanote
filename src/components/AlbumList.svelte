<script>
	import Album from "./Album.svelte";
	import Paginated from "./Paginated.svelte";
	export let list = [];
	export let maxItems = 100;
</script>

<Paginated {list} {maxItems} let:item={album}>
	<Album {album} />
</Paginated>
