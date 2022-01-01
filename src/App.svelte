<script>
	import GroupPlayback from "./add-ons/GroupPlayback.svelte";
	import LibraryView from "./layouts/LibraryView.svelte";
	import AlbumView from "./layouts/AlbumView.svelte";
	import ArtistView from "./layouts/ArtistView.svelte";
	import Search from "./layouts/Search.svelte";
	import Lyrics from "./add-ons/Lyrics.svelte";
	import Modal from "./components/Modal.svelte";
	import IconButton from "./components/IconButton.svelte";
	import Glow from "./components/Glow.svelte";
	import { liveQuery } from "dexie";
	import ServerManager from "./layouts/ServerManager.svelte";
	import { db, library, servers } from "./logic/db";
	import { authString } from "./logic/utils";
	import {
		playing,
		queue,
		queueIndex,
		playState,
		browserHistory,
		browserHistoryIndex,
		browse,
	} from "./logic/stores";
	import Song from "./components/Song.svelte";
	import SongList from "./components/SongList.svelte";
	import { onMount } from "svelte";
	let openModal = "";
	$: console.log(openModal);
	window.db = db;
	$: console.log("Servers: ", $servers);
	$: console.log("Library: ", $library);
	$: console.log("Playing: ", $playing);
	$: console.log("PlayState: ", $playState, Date.now() - $playState.zeroTs);
	onMount(async () => {
		let serversCount = (await db.servers.toArray()).length;
		if (serversCount == 0) {
			openModal = "serverManager";
		}
	});
	$: $playing = $queue[$queueIndex];
	let browsing = {};
	$: browsing = $browserHistory[$browserHistoryIndex];
	$: console.log("browserHistoryIndex: ", $browserHistoryIndex);
	let audioElem;
	$: {
		if (audioElem) {
			if ($playState.playing) {
				audioElem.play();
				audioElem.currentTime = Date.now() / 1000 - $playState.zeroTs;
			} else {
				audioElem.pause();
			}
		}
	}
</script>

<main>
	<div
		class="left"
		style="overflow-y: auto; display: flex; flex-direction: column; height: 100%;"
	>
		<div class="header" style="background-color: #222">
			<svg
				class="logo"
				viewBox="0 0 257 61"
				fill="none"
				style="height: calc(var(--input-height) * 0.75)"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clip-path="url(#clip0_8_2)">
					<path
						d="M9.2642 31.9574C9.2848 28.353 11.3857 26.2109 14.5781 26.2109C17.7706 26.2109 19.6655 28.3118 19.6449 31.8132V50H29.7166V29.8359C29.7372 22.7095 25.3913 17.9517 18.7386 17.9517C14.0632 17.9517 10.5206 20.3203 9.12003 24.1719H8.76989V18.3636H-0.807528V50H9.2642V31.9574ZM44.8706 50.5355C49.2782 50.5355 52.3265 48.826 54.0566 45.5923H54.3038V50H63.7782V28.4972C63.7782 21.8033 57.8258 17.9517 49.7726 17.9517C41.2662 17.9517 36.4466 22.2358 35.6433 28.0028L44.9324 28.3324C45.3649 26.3139 47.0332 25.0781 49.6902 25.0781C52.1618 25.0781 53.7271 26.2727 53.7271 28.3942V28.4972C53.7271 30.4332 51.6262 30.8452 46.2299 31.3189C39.8244 31.8544 34.4693 34.223 34.4693 41.2259C34.4693 47.4872 38.8152 50.5355 44.8706 50.5355ZM47.9806 43.9446C45.6532 43.9446 44.0055 42.8324 44.0055 40.7315C44.0055 38.6925 45.612 37.4567 48.475 37.0241C50.3493 36.7564 52.6561 36.3445 53.7889 35.7472V38.7543C53.7889 41.8438 51.1937 43.9446 47.9806 43.9446ZM80.0083 31.9574C80.0289 28.353 82.1298 26.2109 85.3223 26.2109C88.5147 26.2109 90.4096 28.3118 90.389 31.8132V50H100.461V29.8359C100.481 22.7095 96.1355 17.9517 89.4828 17.9517C84.8074 17.9517 81.2647 20.3203 79.8642 24.1719H79.514V18.3636H69.9366V50H80.0083V31.9574ZM121.464 50.5973C131.412 50.5973 137.447 44.027 137.447 34.2848C137.447 24.522 131.412 17.9517 121.464 17.9517C111.516 17.9517 105.481 24.522 105.481 34.2848C105.481 44.027 111.516 50.5973 121.464 50.5973ZM121.526 42.9972C117.798 42.9972 115.738 39.4545 115.738 34.223C115.738 28.9709 117.798 25.4077 121.526 25.4077C125.13 25.4077 127.19 28.9709 127.19 34.223C127.19 39.4545 125.13 42.9972 121.526 42.9972ZM160.464 18.3636H154.759V10.7841H144.687V18.3636H140.506V25.7784H144.687V41.1641C144.625 47.5696 148.786 50.7827 155.891 50.4531C158.322 50.3295 160.072 49.8352 161.04 49.5469L159.516 42.2763C159.084 42.3793 158.075 42.5852 157.312 42.5852C155.685 42.5852 154.759 41.9261 154.759 40.0518V25.7784H160.464V18.3636ZM180.051 50.5973C188.352 50.5973 193.81 46.581 194.963 40.3608L185.715 40.093C184.933 42.1939 182.873 43.3267 180.237 43.3267C176.364 43.3267 173.975 40.7521 173.975 36.88V36.6122H195.066V34.0994C195.066 23.6776 188.722 17.9517 179.742 17.9517C170.185 17.9517 164.048 24.5014 164.048 34.3054C164.048 44.4389 170.103 50.5973 180.051 50.5973ZM173.975 30.7628C174.119 27.6115 176.612 25.2223 179.948 25.2223C183.264 25.2223 185.653 27.5291 185.695 30.7628H173.975Z"
						style="fill: var(--text)"
					/>
					<path
						d="M257 30.5L205.25 60.3779L205.25 0.622124L257 30.5Z"
						style="fill: var(--text)"
					/>
				</g>
			</svg>
			<div class="horizPanel">
				<IconButton
					icon="storage"
					on:click={(_) => (openModal = "serverManager")}
				/>
				<IconButton
					icon="search"
					on:click={(_) => browse("search", "Search")}
				/>
			</div>
		</div>
		<div
			style="grid-column: 1 / 2; padding: 28px; background-color: #222; flex: 1;"
		>
			<!-- {#if $playing} -->
			<Glow>
				{#if $playing?.coverUrl}
					<img
						src={$playing.server +
							$playing.coverUrl +
							"?auth=" +
							authString($servers, $playing)}
						alt=""
						loading="lazy"
						class="albumCover"
					/>
				{:else}
					<img src="album.svg" alt="" class="albumCover" />
				{/if}
			</Glow>
			<div
				class="vertiPanel"
				style="margin-block: calc(var(--pad) * 1.5); gap: calc(var(--pad) * 1);"
			>
				<h1>{$playing?.title || "--"}</h1>
				<p>
					{$playing?.artist || "--"} &bull; {$playing?.album || "--"} &bull; {$playing?.year ||
						"--"}
				</p>
			</div>
			<audio
				bind:this={audioElem}
				src={$playing?.server +
					$playing?.mediaUrl +
					"?auth=" +
					authString($servers, $playing)}
				on:ended={(_) => {
					console.log("going to next");
					$queueIndex++;
				}}
				on:pause={(e) => {
					console.log(e);
					$playState = { ...$playState, playing: false };
				}}
				on:play={(e) => {
					$playState = {
						...$playState,
						playing: true,
						zeroTs: Date.now() / 1000 - e.target.currentTime,
					};
				}}
				controls
				autoplay
				style="width: 100%;"
			/>
			<!-- {/if} -->
			<h2>Queue</h2>
			<SongList list={$queue} startOffset={$queueIndex} />
		</div>
	</div>
	<div class="browser">
		<div class="horizPanel browserControls">
			<IconButton
				icon="arrow_back"
				on:click={(_) => {
					if ($browserHistoryIndex > 0) {
						$browserHistoryIndex--;
					}
				}}
			/>
			<IconButton
				icon="arrow_forward"
				on:click={(_) => {
					if ($browserHistoryIndex < $browserHistory.length - 1)
						$browserHistoryIndex++;
				}}
			/>
			<IconButton icon="home" on:click={(_) => browse("home", "Library")} />
			<h2>
				{browsing.title}
			</h2>
		</div>
		<div class="browserPanels">
			{#each $browserHistory as browsing, i}
				<div class="browserPanel" class:hidden={i != $browserHistoryIndex}>
					{#if browsing.view == "home"}
						<LibraryView {...browsing.props} />
					{:else if browsing.view == "album"}
						<AlbumView {...browsing.props} />
					{:else if browsing.view == "artist"}
						<ArtistView {...browsing.props} />
					{:else if browsing.view == "search"}
						<Search {...browsing.props} />
					{/if}
				</div>
			{/each}
		</div>
	</div>
	<div
		style="background-color: #000; grid-row: 1/3; grid-column: 3/4; height: 100%; width: 100%; padding: var(--pad); overflow-y: auto;"
	>
		<GroupPlayback />
		<Lyrics />
	</div>
	<Modal id="serverManager" bind:open={openModal}>
		<h1>Let's get connected.</h1>
		<ServerManager />
	</Modal>
</main>

<style lang="scss">
	main {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 400px 2fr minmax(0, 1fr);
		/* flex-direction: column; */
		/* justify-content: center; */
		--logo-height: 48px;
		--pad-top: calc(var(--logo-height) + var(--pad) * 2);
		width: 100%;
		height: 100%;
		/* row-gap: 12px; */
		/* padding: 12px; */
		/* max-width: 1000px; */
	}
	/* .logo {
		position: absolute;
		top: var(--pad);
		height: var(--logo-height);
	} */
	@media screen and (max-width: 800px) {
		div {
			display: none;
		}
	}
	.header {
		padding: var(--pad);
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		align-items: center;
		gap: calc(0.5 * var(--pad));
		width: 100%;
		box-sizing: border-box;
		/* grid-column: 1 / 4; */
	}
	.albumCover {
		width: 100%;
		border-radius: 8px;
	}
	.browser {
		display: flex;
		flex-direction: column;
		// width: 100%;
		overflow-y: auto;
		overflow-x: hidden;
		background-color: var(--bg-light);
		grid-row: 1/3;
		grid-column: 2/3;
		z-index: 1;
		.browserControls {
			> * {
				margin: 0;
			}
		}
	}
	.browserControls {
		// margin-bottom: var(--pad);
		padding: var(--pad);
	}
	.browserPanels {
		// overflow: auto;
		position: relative;
	}
	@keyframes panelIn {
		from {
			transform: scale(0.85);
			opacity: 0;
		}
	}
	.browserPanel {
		width: 100%;
		// transform-origin: 50% 50vw;
		// --transition: 240ms cubic-bezier(0.79, 0, 0.14, 1);
		// transition: var(--transition);
		// animation: panelIn var(--transition);
		position: absolute;
		padding: var(--pad);
		padding-top: 0;
		// left: 0;
		// right: 0;
		&.hidden {
			// transform: scale(0.85);
			// opacity: 0;
			// pointer-events: none;
			display: none;
		}
	}
</style>
