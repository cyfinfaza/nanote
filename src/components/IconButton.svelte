<script>
	export let icon;
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();
	export let autoHide = false;
	let props;
	$: props = { style: $$props.style, class: $$props.class };
</script>

<button {...props} on:click={(_) => dispatch("click")}>
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
</style>
