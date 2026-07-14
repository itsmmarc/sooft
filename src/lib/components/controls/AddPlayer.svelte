<script lang="ts">
	import { Player } from '$lib/storage.svelte';
	import { Tempus2 } from '$lib/api/tempus2/api-tempus2';
	import { type Steam } from '$lib/api/steam/api-steam-types';
	import _ from 'underscore';

	type Error = { state: boolean; msg: string };

	let isOpen = $state(false);
	let fetched = $state(false);
	let player = $state(new Player());
	let error = $state({
		invalidTempusID: { state: false, msg: 'error: invalid tempus id' } as Error,
		noName: { state: false, msg: 'error: no name entered' } as Error,
		noSteamID: { state: false, msg: 'error: no steam id3 entered' } as Error
	});

	async function fetchPlayerByTempusID(tempusId: number) {
		error.invalidTempusID.state = false;
		fetched = false;
		let result = await Tempus2.fetchPlayerByTempusID(tempusId);
		if (!result) {
			error.invalidTempusID.state = true;
		}
		fetched = true;

		player = result as Player;

		let response = await fetch('/api/steam/GetPlayerSummaries', {
			method: 'POST',
			body: JSON.stringify({ id: player.steamID }),
			headers: { 'Content-Type': 'application/json' }
		});

		let data = await response.json();
		if (data) {
			let steamPlayer: Steam.PlayerSummary = data.response;
			console.log(steamPlayer.avatarfull);
			player.avatarURL = steamPlayer.avatarfull;
		}
		player = { ...player };
	}
</script>

<button
	class="button w-2/5 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
	onclick={() => {
		isOpen = true;
	}}>add player</button
>

{#if isOpen}
	<section
		class="absolute z-50 grid h-fit w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2"
	>
		<label for="tempus-id" class="col-span-4">tempus id</label>
		<input
			class="remove-arrow input col-span-4"
			type="number"
			id="tempus-id"
			placeholder="tempus id"
			onkeyup={(e) => {
				const value = (e.target as HTMLInputElement).value;
				player.tempusID = +value;
			}}
		/>
		<button
			class="button col-span-4 w-1/2 justify-self-center border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
			onclick={() => {
				if (player.tempusID) {
					fetchPlayerByTempusID(player.tempusID);
				}
			}}>fetch</button
		>

		<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

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
			<span class="fi fi-{player.flag} col-span-1 ml-4 rounded text-[1.5rem]"></span>

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
				let errorFound = false;
				if (!player.name) {
					error.noName.state = true;
					errorFound = true;
				}
				if (!player.steamID3) {
					error.noSteamID.state = true;
					errorFound = true;
				}

				if (errorFound) {
					return;
				}

				isOpen = false;
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
