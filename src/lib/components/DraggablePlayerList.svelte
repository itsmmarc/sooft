<script lang="ts">
	import type { Player } from '$lib/types';

	let itemAIndex = $state(-1);
	let itemBIndex = $state(-1);

	type Props = {
		players: Player[];
		onremove: Function;
		onchange?: Function;
		debug?: boolean;
		class?: string;
	};
	let { players = $bindable(), onchange, onremove, debug, class: styleClass }: Props = $props();

	function removePlayer(player: Player) {
		players = players.filter((p) => p.tempusID != player.tempusID);
	}
</script>

<div class="bg-obs-background {styleClass}">
	<ul class="flex flex-col gap-2">
		{#each players as player, i (i)}
			<li
				class="grid grid-cols-12 bg-obs-padding"
				draggable={true}
				ondragstart={() => {
					itemAIndex = i;
				}}
				ondragenter={() => {
					itemBIndex = i;
				}}
				ondragend={() => (itemAIndex = -1)}
				ondragover={(e) => e.preventDefault()}
				ondrop={() => {
					if (debug) console.log(players);

					let temp = players[itemAIndex];

					// remove dragged item
					players.splice(itemAIndex, 1);

					// place dragged item in location of dragover
					players.splice(itemBIndex, 0, temp);

					if (onchange) onchange();

					players = [...players];

					if (debug) {
						console.log(players);
						console.log('-------------------------');
					}
				}}
			>
				<div class="col-span-3">
					<img
						src={player.avatarURL}
						alt=""
						class="size-12 rounded-xl object-cover object-center"
						draggable="false"
					/>
				</div>
				<div class="col-span-6">{player.name}</div>
				<div class="col-span-3">
					<button
						class="button-remove"
						onclick={() => {
							removePlayer(player);
							onremove();
						}}>remove</button
					>
				</div>
			</li>
		{/each}
	</ul>
</div>
