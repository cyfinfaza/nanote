<script>
	import { playing } from "../logic/stores";
	let hasLyrics = false;
	let lyrics = "";
	async function fetchLyrics(song) {
		// fetch lyrics from lyrics.ovh
		if (!song) {
			return;
		}
		hasLyrics = false;
		const response = await fetch(
			`https://api.lyrics.ovh/v1/${song.artist}/${song.title}`
		);
		const data = await response.json();
		console.log(data);
		if (data.lyrics) {
			hasLyrics = true;
			lyrics = data.lyrics;
		} else {
			hasLyrics = false;
			lyrics = "";
		}
	}
	$: fetchLyrics($playing);
</script>

{#if hasLyrics}
	<div>
		<h1>Lyrics</h1>
		<p>
			{#each lyrics
				.trim()
				.split("\n")
				.slice(lyrics.trim().indexOf("Paroles") == 0 ? 1 : 0) as line}
				{line}<br />
			{/each}
		</p>
	</div>
{/if}
