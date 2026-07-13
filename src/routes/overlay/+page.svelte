<script lang="ts">
	import { settings } from '$lib/storage.svelte';

	import MatchOverlay from '$lib/overlays/MatchOverlay.svelte';
	import MapOverlay from '$lib/overlays/MapOverlay.svelte';
	import BracketOverlay from '$lib/overlays/BracketOverlay.svelte';
	import PlayerCardOverlay from '$lib/overlays/PlayerCardOverlay.svelte';
	import PlayerListOverlay from '$lib/overlays/PlayerListOverlay.svelte';
	import ThanksOverlay from '$lib/overlays/ThanksOverlay.svelte';

	let page = $derived(settings.current.overlayScene);
</script>

{#if page == 'MatchOverlay'}
	<MatchOverlay />
{/if}
{#if page == 'MapOverlay'}
	<MapOverlay />
{/if}
{#if page == 'BracketOverlay'}
	<BracketOverlay />
{/if}
{#if page == 'PlayerCardOverlay'}
	<PlayerCardOverlay />
{/if}
{#if page == 'PlayerListOverlay'}
	<PlayerListOverlay />
{/if}
{#if page == 'ThanksOverlay'}
	<ThanksOverlay />
{/if}
