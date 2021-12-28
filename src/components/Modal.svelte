<script>
	import IconButton from "./IconButton.svelte";
	export let open;
	export let id;
	let className;
	$: className = "modal" + (open === id ? " open" : "");
	$: console.log(open);
</script>

<div class={className}>
	<div>
		<IconButton
			icon="close"
			on:click={(_) => (open = "")}
			style="position: fixed; top: 16px; right: 16px;"
		/>
		<slot />
	</div>
</div>

<style lang="scss">
	.modal {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		inset: 0;
		background: #1118;
		opacity: 0;
		--transition: 240ms cubic-bezier(0.87, 0.01, 0.1, 0.99);
		transition: var(--transition);
		pointer-events: none;
		z-index: 99;
		> div {
			width: 80%;
			// height: 80%;
			max-width: 500px;
			max-height: min(500px, 100%);
			transform: scale(0.5);
			background: #222;
			border-radius: 16px;
			transition: var(--transition);
			padding: 16px;
			overflow: auto;
		}
	}
	.modal.open {
		opacity: 1;
		z-index: 100;
		pointer-events: all;
		> div {
			transform: scale(1);
		}
	}
	.modalClose {
		position: absolute;
		top: 16;
		right: 16;
	}
</style>
