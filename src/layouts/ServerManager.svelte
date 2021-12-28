<script>
	import { servers, db } from "../logic/db";
	import { fade } from "svelte/transition";
	import IconButton from "../components/IconButton.svelte";
	import Prompt from "../components/Prompt.svelte";

	function deleteServer(server) {
		db.servers.where({ url: server.url, profile: server.profile }).delete();
	}

	let newServerAddress = "";
	let newServerProfiles = [];
	let selectedProfile = 0;
	let errorText = "";
	$: console.log(newServerProfiles);
	async function setNewServerAddress(addr) {
		console.log(addr);
		newServerAddress = addr;
		newServerProfiles = [];
		selectedProfile = 0;
		errorText = "";
		try {
			newServerProfiles = await (
				await (await fetch(newServerAddress + "/users")).json()
			).filter(async (profile) => {
				return (
					(await db.servers
						.where({ url: newServerAddress, profile: profile.user })
						.count()) == 0
				);
			});
		} catch (error) {
			errorText = "Hmm. That didn't work. Check the console for details.";
			console.error(error);
		}
	}
	async function tryConnect(pass) {
		errorText = "";
		try {
			let authHeaders = new Headers();
			authHeaders.append(
				"Authorization",
				`Basic ${btoa(newServerProfiles[selectedProfile].user + ":" + pass)}`
			);
			let response = await fetch(newServerAddress + "/library", {
				headers: authHeaders,
			});
			if (response.status == 401) {
				errorText = "Incorrect password.";
				return;
			}
			if (response.status != 200) {
				errorText = "Hmm. That didn't work. Check the console for details.";
				console.error(response);
				return;
			} else {
				db.servers.add({
					url: newServerAddress,
					profile: newServerProfiles[selectedProfile].user,
					key: pass,
				});
				newServerAddress = "";
				newServerProfiles = [];
				selectedProfile = 0;
			}
		} catch (error) {
			errorText = "Hmm. That didn't work. Check the console for details.";
			console.error(error);
		}
	}
</script>

<div class="container">
	{#if ($servers || []).length > 0}
		<div>
			<h2>Libraries</h2>
			{#each $servers || [] as server}
				<div class="server">
					<IconButton icon="delete" on:click={(_) => deleteServer(server)} />
					<img
						src={server.url + "/userImg/" + server.profile}
						style="border-radius: 50%; height: 100%; aspect-ratio: 1/1"
						alt=""
					/>
					<div class="serverName">
						<h3 class="serverIp">{server.profile}</h3>
						<p class="serverName">{server.url}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<div>
		<h2>Add Library</h2>
		<h4>Connect to a server</h4>
		<Prompt
			prompt="https://nanote.example.com"
			onSubmit={(e) => setNewServerAddress(e)}
		/>
		{#if newServerProfiles.length > 0}
			<h4>Select a profile</h4>
			<div style="display: flex; flex-wrap: wrap; gap: 12px">
				{#each newServerProfiles || [] as server, i}
					<button
						class="server"
						style={"width: unset; padding-inline-end: 16px;" +
							(selectedProfile == i && "border-left: 8px solid var(--text);")}
						on:click={(_) => (selectedProfile = i)}
					>
						<img
							src={newServerAddress + "/userImg/" + server.user}
							style="border-radius: 50%; height: 100%; aspect-ratio: 1/1"
							alt=""
						/>
						<div class="serverName">
							<h3 class="serverIp">{server.user}</h3>
						</div>
					</button>
				{/each}
			</div>
			<h4>Unlock &amp; add</h4>
			<Prompt
				prompt="Enter password"
				onSubmit={(e) => tryConnect(e)}
				submitIcon="done"
				password
			/>
		{/if}
		{#if errorText}
			<p style="color: red;">{errorText}</p>
		{/if}
	</div>
</div>

<style lang="scss">
	.container {
		// display: grid;
		// grid-template-columns: 1fr 1fr;
		display: flex;
		flex-direction: column;
		gap: 32px;
		> div {
			display: flex;
			flex-direction: column;
			gap: 12px;
			// margin-bottom: 32px;
			> * {
				margin: 0;
			}
		}
	}
	.server {
		display: flex;
		align-items: center;
		gap: 12px;
		height: 64px;
		width: 100%;
	}
	.serverName {
		display: flex;
		flex-direction: column;
		justify-content: center;
		> * {
			margin: 0;
		}
	}
	button {
		border: 0px solid var(--text);
	}
</style>
