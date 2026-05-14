<script lang="ts">
	import { type Player, items } from '$lib/storage.svelte';
	import { slide } from 'svelte/transition';

	function addPlayer() {
		items.current.players.push(player);
	}
	let isOpen = false;
	let noNameError = false;
	let player: Player = { name: '', score: 0, rank: { soldier: 0, demo: 0, overall: 0 } };
</script>

<div transition:slide>
	<button
		class="button w-2/5 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
		onclick={() => {
			isOpen = true;
		}}>add player</button
	>
	<button
		class="button-remove"
		onclick={() => {
			items.current.players = [{ name: '', score: 0 } as Player];
		}}>remove all</button
	>
</div>
{#if isOpen}
	<div class="absolute z-50 grid w-full grid-cols-2 self-center border-2 bg-obs-content">
		<label for="name">name</label>
		<input
			type="text"
			id="name"
			placeholder="*name"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.name = value;
			}}
		/>

		<label for="avatarURL">avatar URL</label>
		<input
			type="text"
			id="avatarURL"
			placeholder="avatar URL"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.avatarURL = value;
			}}
		/>

		<label for="tag">tag</label>
		<input
			type="text"
			id="tag"
			placeholder="tag"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.tag = value;
			}}
		/>

		<label for="flag"
			>flag
			<a href="https://flagicons.lipis.dev/" target="_blank">
				<span class="icon-[mdi--question-mark]"></span>
			</a>
		</label>
		<div>
			<input
				type="text"
				id="flag"
				placeholder="flag"
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.flag = value;
				}}
			/>
			<span class="fi fi-{player.flag} rounded"></span>
		</div>

		<!-- {#if item === 'flags'} -->
		<!-- svelte- ignore a11y_consider_explicit_label -->
		<!-- <a href="https://flagicons.lipis.dev/" target="_blank"
			><span class="icon-[mdi--question-mark]"></span></a
		> -->
		<!-- {/if} -->

		<h2 class="col-span-2 font-bold">rank</h2>
		<div class="col-span-2 grid grid-cols-6">
			<label for="rank-soldier">soldier</label>
			<input
				class="remove-arrow"
				type="number"
				pattern="[0-9]"
				id="rank-soldier"
				placeholder="soldier"
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.rank!.soldier = parseInt(value);
				}}
			/>

			<label for="rank-demo">demo</label>
			<input
				class="remove-arrow"
				type="number"
				pattern="[0-9]"
				id="rank-demo"
				placeholder="demo"
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.rank!.demo = parseInt(value);
				}}
			/>

			<label for="rank-overall">overall</label>
			<input
				class="remove-arrow"
				type="number"
				pattern="[0-9]"
				id="rank-overall"
				placeholder="overall"
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.rank!.overall = parseInt(value);
				}}
			/>
		</div>

		<label for="numWRs">number of WRs</label>
		<input
			class="remove-arrow"
			type="number"
			pattern="[0-9]"
			id="numWRs"
			placeholder="numWRs"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.numWRs = parseInt(value);
			}}
		/>

		<label for="bestRun">best run</label>
		<input
			type="text"
			id="bestRun"
			placeholder="best run"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.bestRun = value;
			}}
		/>
		<button
			class="button border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			// value=""
			onclick={() => {
				if (player.name != '') {
					addPlayer();
					isOpen = false;
				} else {
					noNameError = true;
				}
			}}>add player</button
		>
		{#if noNameError}
			<div>error: no name entered</div>
		{/if}
		<button
			class="button-remove absolute top-0 right-0"
			onclick={() => {
				isOpen = false;
			}}>close</button
		>
	</div>
{/if}
