<script lang="ts">
	import { items } from '$lib/storage.svelte';
	import { Player } from '$lib/types';
	import { Tempus2 } from '$lib/api/tempus2/api-tempus2';
	import { type Steam } from '$lib/api/steam/api-steam-types';
	import _ from 'underscore';
	import Flag from '../Flag.svelte';

	type Error = { state: boolean; msg: string };

	let isOpen = $state(false);
	let queryTerm = $state('');
	let searchResults: Tempus2.PlayerInfo[] = $state([]);
	let fetched = $state(false);
	let player = $state(new Player());
	let error = $state({
		invalidTempusID: { state: false, msg: 'error: invalid tempus id' } as Error,
		noName: { state: false, msg: 'error: no name entered' } as Error,
		noSteamID3: { state: false, msg: 'error: no steamid3 entered' } as Error,
		noSteamID64: { state: false, msg: 'error: no steamid64 entered' } as Error,
		noTempusID: { state: false, msg: 'error: no tempus id entered' } as Error
	});

	async function fetchPlayerByTempusID(tempusId: number) {
		error.invalidTempusID.state = false;
		fetched = false;
		let result = await Tempus2.fetchPlayerByTempusID(tempusId);
		if (!result) {
			error.invalidTempusID.state = true;
			return;
		}
		fetched = true;

		player = result as Player;

		// get steam pfp
		let response = await fetch('/api/steam/GetPlayerSummaries', {
			method: 'POST',
			body: JSON.stringify({ id: player.steamID }),
			headers: { 'Content-Type': 'application/json' }
		});

		let data = await response.json();
		if (data) {
			let steamPlayer: Steam.PlayerSummary = data.response;
			player.avatarURL = steamPlayer.avatarfull;
		}
		player = { ...player };
	}

	async function searchPlayers(queryTerm: string) {
		fetched = false;
		searchResults = await Tempus2.searchPlayers(queryTerm);
	}

	function addPlayer(player: Player) {
		let errorFound = false;
		if (!player.name) {
			error.noName.state = true;
			errorFound = true;
		}
		if (!player.tempusID) {
			error.noSteamID3.state = true;
			errorFound = true;
		}
		if (!player.steamID) {
			error.noSteamID3.state = true;
			errorFound = true;
		}
		if (!player.steamID3) {
			error.noSteamID3.state = true;
			errorFound = true;
		}

		if (errorFound) {
			return;
		}

		items.current.players = [...items.current.players, player];
		console.log('added player:');
		console.log(player);

		isOpen = false;
	}

	async function onSearch(queryTerm: string) {
		fetched = false;
		if (queryTerm) {
			if (queryTerm.includes('_')) {
				await fetchPlayerByTempusID(parseInt(queryTerm));
			}
			if (!fetched) {
				searchPlayers(queryTerm);
			}
		}
	}

	function clear() {
		player = new Player();
		queryTerm = '';
		searchResults = [];
		fetched = false;
	}
</script>

<button
	class="button w-2/5 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
	onclick={() => {
		clear();
		isOpen = true;
	}}>add player</button
>

{#if isOpen}
	<section
		class="absolute z-50 grid h-fit w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2"
	>
		<div class="col-span-full flex gap-2">
			<label for="tempus-id" class="col-span-4">search</label>
			<input
				class="remove-arrow input col-span-4"
				type="text"
				id="tempus-id"
				placeholder="tempus id or name"
				onkeyup={(e) => {
					queryTerm = (e.target as HTMLInputElement).value;
				}}
			/>
			<button
				class="button col-span-4 max-w-30 justify-self-center border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
				onclick={() => {
					onSearch(queryTerm);
				}}>fetch</button
			>
		</div>

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

		{#if searchResults.length >= 1}
			<div class="col-span-full grid grid-cols-12 gap-2">
				<div class="col-span-3">tempus id</div>
				<div class="col-span-6">name</div>

				<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

				{#each searchResults as searchResult, i (i)}
					<div class="col-span-3">{searchResult.id}</div>
					<div class="col-span-6">{searchResult.name}</div>
					<button
						class="button col-span-3 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
						onclick={() => {
							fetchPlayerByTempusID(searchResult.id);
							searchResults = [];
						}}>select</button
					>
				{/each}

				<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />
			</div>
		{/if}

		{#if fetched}
			<label for="name" class="col-span-6">name</label>
			<input
				class="input col-span-4"
				type="text"
				id="name"
				placeholder="name"
				value={player.name}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.name = value;
				}}
			/>

			{#if player.avatarURL}
				<img
					src={player.avatarURL}
					alt=""
					class="col-span-2 row-span-2 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
					draggable="false"
				/>
			{/if}

			<label for="avatarURL" class="col-span-6">avatar URL</label>
			<input
				class="input col-span-4"
				type="text"
				id="avatarURL"
				placeholder="avatar URL"
				value={player.avatarURL}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.avatarURL = value;
				}}
			/>

			<label for="flag" class="col-span-5">flag </label>
			<a
				class="col-span-1"
				aria-label="flag-preview"
				href="https://flagicons.lipis.dev/"
				target="_blank"
			>
				<span class="icon-[mdi--question-mark]"></span>
			</a>
			<input
				class="input col-span-4"
				type="text"
				id="flag"
				placeholder="flag"
				value={player.flag}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.flag = value;
				}}
			/>
			<Flag code={player.flag} styleclass="text-[1.5rem] rounded col-span-1 ml-4" />

			<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

			<label class="col-span-6" for="bestRun">best run</label>
			<input
				class="input col-span-4"
				type="text"
				id="bestRun"
				placeholder="best run"
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.bestRun = value;
				}}
			/>

			<label class="col-span-6" for="favouriteMap">favourite map</label>
			<input
				class="input col-span-4"
				type="text"
				id="favouriteMap"
				placeholder="favourite map"
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.favouriteMap = value;
				}}
			/>

			<label class="col-span-6" for="note">note</label>
			<textarea
				class="input col-span-4 h-16 align-text-top"
				id="note"
				placeholder="note"
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					player.note = value;
				}}
			></textarea>

			<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />
		{/if}

		<button
			class="button col-span-6 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			// value=""
			onclick={() => {
				addPlayer(player);
			}}>add player</button
		>

		<div class="col-span-6 flex flex-col">
			{#each Object.values(error) as e, i (i)}
				{#if e.state}
					<div>{e.msg}</div>
				{/if}
			{/each}
		</div>

		<button
			class="button-remove absolute top-0 right-2"
			onclick={() => {
				isOpen = false;
			}}>✖</button
		>
	</section>
{/if}
