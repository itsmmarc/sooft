<script lang="ts">
	import { items } from '$lib/storage.svelte';
	import { TFMap } from '$lib/types';
	import { Tempus2 } from '$lib/api/tempus2/api-tempus2';
	import _ from 'underscore';
	import { TempusPlaza } from '$lib/api/tempusplaza/api-tempusplaza';

	type Error = { state: boolean; msg: string };

	let isOpen = $state(false);
	let queryTerm = $state('');
	let searchResults: Tempus2.MapInfo[] = $state([]);
	let fetched = $state(false);
	let map = $state(new TFMap());
	let error = $state({
		invalidMapName: { state: false, msg: 'error: invalid map name' } as Error
	});

	async function fetchMapByName(mapName: string) {
		error.invalidMapName.state = false;
		fetched = false;
		let result = await Tempus2.fetchMapByName(mapName);
		if (!result) {
			error.invalidMapName.state = true;
			return;
		}
		fetched = true;

		map = result as TFMap;

		await Tempus2.fetchMapPrs(map);
	}

	async function searchMaps(queryTerm: string) {
		fetched = false;
		searchResults = await Tempus2.searchMaps(queryTerm);
	}

	function addMap(map: TFMap) {
		let errorFound = false;

		if (!map.getFileName()) {
			error.invalidMapName.state = true;
			errorFound = true;
		}

		if (errorFound) {
			return;
		}

		items.current.maps = [...items.current.maps, map];
		console.log('added map:');
		console.log(map);

		isOpen = false;
	}

	async function onSearch(queryTerm: string) {
		fetched = false;
		if (queryTerm) {
			if (queryTerm.includes('_')) {
				await fetchMapByName(queryTerm);
			}
			if (!fetched) {
				searchMaps(queryTerm);
			}
		}
	}

	function clear() {
		map = new TFMap();
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
	}}>add map</button
>

{#if isOpen}
	<section
		class="absolute z-50 grid h-fit w-full grid-cols-12 gap-y-1 self-center border-2 bg-obs-content p-2"
	>
		<div class="col-span-full flex gap-2">
			<label for="map-name" class="col-span-4">search</label>
			<input
				class="remove-arrow input col-span-4"
				type="text"
				id="map-name"
				placeholder="name"
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
				<div class="col-span-3">image</div>
				<div class="col-span-6">name</div>

				<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />

				{#each searchResults as searchResult, i (i)}
					<div class="col-span-3">
						<img
							src={TempusPlaza.getImageUrl(searchResult.name)}
							alt=""
							class="size-12 w-full rounded-xl object-cover object-center"
							draggable="false"
						/>
					</div>
					<div class="col-span-6">{searchResult.name}</div>
					<button
						class="button col-span-3 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
						onclick={() => {
							fetchMapByName(searchResult.name);
							searchResults = [];
						}}>select</button
					>
				{/each}

				<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />
			</div>
		{/if}

		{#if fetched}
			<label for="short-name" class="col-span-6">short name</label>
			<input
				class="input col-span-4"
				type="text"
				id="name"
				placeholder="name"
				value={map.shortName}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					map.shortName = value;
				}}
			/>

			{#if map.imageURL}
				<img
					src={map.imageURL}
					alt=""
					class="col-span-2 row-span-2 mt-2 ml-2 size-12 rounded-xl object-cover object-center"
					draggable="false"
				/>
			{/if}

			<label for="imageURL" class="col-span-6">image URL</label>
			<input
				class="input col-span-4"
				type="text"
				id="imageURL"
				placeholder="avatar URL"
				value={map.imageURL}
				onkeyup={(e) => {
					const value = (e.target as HTMLInputElement).value;
					map.imageURL = value;
				}}
			/>

			<hr class="col-span-12 h-0.5 w-full border-none bg-obs-padding" />
		{/if}

		{#if fetched}
			<button
				class="button col-span-6 border-ctp-lavender-950/50 bg-ctp-lavender/35 px-2 hover:bg-ctp-lavender/85"
				// value=""
				onclick={() => {
					addMap(map);
				}}>add map</button
			>
		{/if}

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
