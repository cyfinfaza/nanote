<script>
	import IconButton from "./IconButton.svelte";
	export let open;
	export let id;
	$: console.log(open);
</script>

<div class="modal" class:open={open === id}>
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
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		inset: 0;
		background: #1118;
		opacity: 0;
		--transition: 240ms cubic-bezier(0.87, 0.01, 0.1, 0.99);
		transition: var(--transition);
		pointer-events: none;
		z-index: 200;
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
		z-index: 200;
		pointer-events: all;
		> div {
			transform: scale(1);
		}
	}
	@media screen and (max-width: 800px) {
		.modal {
			> div {
				max-width: 100%;
				max-height: 100%;
				width: 100%;
				height: 100%;
				transform: translateY(100%);
				transition-duration: 400ms;
			}
			transition-duration: 400ms;
			position: static;
			grid-row: 1/3;
			grid-column: 1/2;
			padding-top: 32px;
		}
	}
	// .modalClose {
	// 	position: absolute;
	// 	top: 16;
	// 	right: 16;
	// }
</style>
