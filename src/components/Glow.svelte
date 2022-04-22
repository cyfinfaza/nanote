<script>
	export let noMobile = false;
</script>

<div style="position: relative;">
	<div class="real">
		<slot />
	</div>
	<div class="glow" class:noMobile>
		<slot />
	</div>
</div>

<style>
	.real {
		position: absolute;
		z-index: 1;
		width: 100%;
	}
	.glow {
		filter: blur(48px);
		z-index: -1;
		width: 100%;
	}
	@media screen and (max-width: 800px) {
		.noMobile {
			filter: none;
		}
	}
</style>
