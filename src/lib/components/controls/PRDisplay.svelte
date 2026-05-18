<script lang="ts">
	import { items, overlay } from '$lib/storage.svelte';
	import { fade } from 'svelte/transition';
</script>

<section>
	{#each Object.entries(items.current.maps) as [key, map], i (i)}
		<h1>{key}</h1>
		{console.log(overlay.current.leftPlayer.pr)}
		<div>{overlay.current.leftPlayer.pr![key] ?? ''}</div>
		<div>{overlay.current.rightPlayer.pr![key] ?? ''}</div>
		{#if map.imageURL}
			<img
				in:fade
				src={map.imageURL}
				alt=""
				class="size-24 rounded-xl object-cover object-center"
				draggable="false"
			/>
		{/if}
	{/each}
</section>
