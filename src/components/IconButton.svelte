<script>
	export let icon;
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	export let autoHide = false;
	let props;
	$: props = { style: $$props.style, class: $$props.class };
	export let accent = false;
</script>

<button {...props} on:click={(_) => dispatch("click")} class:accent>
	<span class="material-icons">{icon}</span>
	{#if autoHide}
		<div class="hideOnMobile">
			<slot />
		</div>
	{:else}
		<slot />
	{/if}
</button>

<style>
	@media screen and (max-width: 500px) {
		.hideOnMobile {
			display: none;
		}
	}
	.accent {
		background: var(--button-accent);
		color: var(--button-accent-text);
	}
</style>
