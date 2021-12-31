<script>
	import IconButton from "../components/IconButton.svelte";
	import { queue, playing, queueIndex, playState } from "../logic/stores";
	import { persistent } from "../logic/utils";
	import Paho from "paho-mqtt";
	import { onMount } from "svelte";
	let connected = false;
	let message = "";
	let server = persistent("GroupPlayback/server", "");
	let username = persistent("GroupPlayback/username", "");
	let password = persistent("GroupPlayback/password", "");
	let pub = persistent("GroupPlayback/pub", "");
	let sub = persistent("GroupPlayback/sub", "");
	let client;
	let clientId = Math.random().toString(36).substring(2);
	let pubb = "";
	$: pubb = $pub;
	console.log("clientId: ", clientId);
	let lastQueue = "";
	function publishQueue(q) {
		if (client?.isConnected() && pubb) {
			let newQueue = JSON.stringify(q.slice(0, 1000));
			if (newQueue !== lastQueue) {
				console.log("publishing queue");
				client.publish(
					"nanote-group-playback/" + pubb + "/queue",
					newQueue,
					1,
					true
				);
				lastQueue = newQueue;
			}
		}
	}
	$: publishQueue($queue);
	function publishQueueIndex(qi) {
		if (client?.isConnected() && pubb) {
			console.log("publishing queueIndex");
			client.publish(
				"nanote-group-playback/" + pubb + "/queueIndex",
				JSON.stringify(qi),
				1,
				true
			);
		}
	}
	$: publishQueueIndex($queueIndex);
	let lastPlayState = "";
	function publishPlayState(ps) {
		if (client?.isConnected() && pubb) {
			let newPlayState = JSON.stringify(ps);
			if (newPlayState !== lastPlayState) {
				console.log("publishing playState");
				client.publish(
					"nanote-group-playback/" + pubb + "/playState",
					newPlayState,
					1,
					true
				);
				lastPlayState = newPlayState;
			}
		}
	}
	$: publishPlayState($playState);
	function connect() {
		if (!($server && $username && $password)) {
			console.log("server, username, password undefined");
			return;
		}
		client = new Paho.Client($server, clientId);
		client.onConnectionLost = () => {
			connected = false;
			message = "Disconnected";
		};
		client.onMessageArrived = (message) => {
			console.log("message arrived: ", message);
			let payload = JSON.parse(message.payloadString);
			let type = message.destinationName.split("/").slice(-1)[0];
			if (type === "queue") {
				console.log("queue received");
				queue.set(payload);
			} else if (type === "queueIndex") {
				console.log("queueIndex received");
				queueIndex.set(payload);
			} else if (type === "playState") {
				console.log("playState received");
				lastPlayState = JSON.stringify(payload);
				playState.set(payload);
			}
		};
		message = "Connecting...";
		client.connect({
			onSuccess: () => {
				connected = true;
				message = "Connected";
				publishQueue($queue);
				publishQueueIndex($queueIndex);
				publishPlayState($playState);
				if ($sub) {
					client.subscribe("nanote-group-playback/" + $sub + "/#");
				}
			},
			onFailure: (e) => {
				console.error(e);
				connected = false;
				message = "Faliure";
			},
			useSSL: true,
			userName: $username,
			password: $password,
		});
	}
	function disconnect() {
		client.disconnect();
	}
</script>

<div class:connected>
	<h1>Remote/Group Playback</h1>
	<div class="optionsGrid">
		<input
			class="notWhileConnected"
			type="text"
			placeholder="MQTT Server"
			bind:value={$server}
		/>
		<input
			class="notWhileConnected"
			type="text"
			placeholder="Username"
			bind:value={$username}
		/>
		<input
			class="notWhileConnected"
			type="password"
			placeholder="Password"
			bind:value={$password}
		/>
		<input
			class="notWhileConnected"
			type="text"
			placeholder="Subscribe"
			bind:value={$sub}
		/>
		<div class="horizPanel">
			{#if connected}
				<IconButton icon="wifi" on:click={disconnect}>Disconnect</IconButton>
			{:else}
				<IconButton icon="wifi" on:click={connect}>Connect</IconButton>
			{/if}
			<p style="margin: 0;">{message}</p>
		</div>
		<input type="text" placeholder="Publish" bind:value={$pub} />
	</div>
</div>

<style lang="scss">
	.optionsGrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		width: 100%;
		gap: calc(var(--pad) * 0.5);
		& > * {
			width: 100%;
		}
	}
	.connected {
		.notWhileConnected {
			pointer-events: none;
			filter: contrast(0.5);
		}
	}
</style>
