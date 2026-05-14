<script lang="ts">
	import { items, overlay } from '$lib/storage.svelte';
	import Button from './Button.svelte';

	type Props = {
		sideKey: 'leftPlayer' | 'rightPlayer';
	};

	let { sideKey }: Props = $props();
</script>

<div class="button-container">
	{#each items.current.players as player, i (i)}
		{@const selected =
			(overlay.current[sideKey].name ?? items.current.players.at(0)!.name) === player.name}
		<Button
			{selected}
			onclick={() => {
				overlay.current[sideKey] = player;
			}}
			oncontextmenu={() => {
				if (player.name == '') {
					return;
				}
				// reset if deleting selected
				if (overlay.current[sideKey] === player) {
					// @ts-expect-error can index
					overlay.current[sideKey][key] = items.current[item].at(0) ?? '';
				}
				items.current.players.splice(items.current.players.indexOf(player), 1);
			}}
		>
			{#if player.name == ''}
				✖
			{:else}
				{player.name}
			{/if}
			<!-- {:else if item === 'flags'}
				<span class="fi fi-{player}"></span>
				<span>{player}</span>
			{:else if item === 'avatarURLs'}
				<img
					src={player}
					alt=""
					class="size-12 object-cover object-center {selected ? '' : 'opacity-35'}"
					draggable="false"
				/> -->
		</Button>
	{/each}
</div>
