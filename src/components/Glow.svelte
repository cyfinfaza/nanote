<div style="position: relative;">
	<div style="position: absolute; z-index: 1; width: 100%">
		<slot />
	</div>
	<div style="filter: blur(48px); z-index: -1; width: 100%">
		<slot />
	</div>
</div>
