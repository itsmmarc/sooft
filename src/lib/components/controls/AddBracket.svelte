<script lang="ts">
	import PopOver from './PopOver.svelte';
	import _ from 'underscore';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import { Bracket8, Bracket4, type Match } from '$lib/Bracket.svelte';
	import { Player, type TournamentFormat } from '$lib/types';
	import DraggableSwapList from '../DraggableSwapList.svelte';

	type Error = { state: boolean; msg: string };

	let error = $state({
		notEnoughPlayers: {
			state: false,
			msg: 'error: incorrect number of players for bracket'
		} as Error
	});
	let popoverState: 'open' | 'closed' = $state('closed');

	function clear() {}

	type Props = {
		container?: boolean;
		format: TournamentFormat;
		players: Player[];
		value: Bracket4 | Bracket8 | undefined;
	};
	let { container = true, format, players, value = $bindable() }: Props = $props();

	let bracket: Bracket4 | Bracket8 = $derived(
		format == 'DoubleElim4Player' ? new Bracket4() : new Bracket8()
	);
	let startingMatches = $derived(getStartingMatches(bracket, format));

	function getStartingMatches(bracket: Bracket4 | Bracket8, format: TournamentFormat): Player[] {
		let arr: Player[] = [];

		let maxPlayers = format == 'DoubleElim4Player' ? 4 : 8;
		for (let i = 0; i < maxPlayers / 2; i++) {
			arr.push(bracket.Upper.QuarterFinals[i].A);
			arr.push(bracket.Upper.QuarterFinals[i].B);
		}
		return arr;
	}

	function syncStartingMatches(startingMatches: Player[], format: TournamentFormat) {
		let maxPlayers = format == 'DoubleElim4Player' ? 4 : 8;
		for (let i = 0; i < maxPlayers; i++) {
			bracket.Upper.QuarterFinals[Math.floor(i / 2)][i % 2 == 0 ? 'A' : 'B'] = startingMatches[i];
		}
		bracket = { ...bracket };
	}

	$effect(() => {
		if (popoverState) {
			let i = 0;
			for (const match of Object.values(bracket.Upper.QuarterFinals)) {
				match.A = players[i];
				match.B = players[players.length - 1 - i];
				i++;
			}
		}
	});
</script>

<PopOver title="add bracket" bind:state={popoverState} clearfn={clear} {container}>
	<section class="grid grid-cols-12 gap-2">
		<!-- MARK: Bracket Display -->
		{#if bracket}
			<div class="col-span-full flex flex-col">
				<h2 class="text-3xl" style:filter={getFiltersStyle()}>Starting Matches</h2>
				<DraggableSwapList
					bind:items={startingMatches}
					labelkey="name"
					pairitems={true}
					onchange={() => {
						syncStartingMatches(startingMatches, format);
					}}
				/>
			</div>

			<hr class="hr" />

			<button
				class="button col-span-6"
				onclick={() => {
					value = { ...bracket };
					popoverState = 'closed';
				}}>save bracket</button
			>
		{/if}

		<div class="col-span-6 flex flex-col">
			{#each Object.values(error) as e, i (i)}
				{#if e.state}
					<div>{e.msg}</div>
				{/if}
			{/each}
		</div>
	</section>
</PopOver>
