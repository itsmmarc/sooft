<script lang="ts">
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<div class="relative flex h-fit w-full max-w-2/3 flex-col bg-obs-content p-4">
	{@render children()}
</div>

<style>
	:root {
		background-color: var(--color-obs-background);
	}
</style>
