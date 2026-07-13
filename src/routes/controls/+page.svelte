<script lang="ts">
	import kofi_symbol from '$lib/assets/kofi_symbol.svg';
	import Accordion from '$lib/components/controls/Accordion.svelte';
	import Button from '$lib/components/controls/Button.svelte';
	import Checkbox from '$lib/components/controls/Checkbox.svelte';
	import ItemInput from '$lib/components/controls/ItemInput.svelte';
	import Player from '$lib/components/controls/Player.svelte';
	import PlayerInput from '$lib/components/controls/PlayerInput.svelte';
	import MapInput from '$lib/components/controls/MapInput.svelte';
	import RangeInput from '$lib/components/controls/RangeInput.svelte';
	import { getFiltersStyle } from '$lib/filters.svelte';
	import {
		settings,
		overlay,
		items,
		type Settings,
		defaultStages,
		defaultSettings,
		fullReset,
		type TFClass,
		TFClasses,
		Fonts,
		type Font,
		MonoFonts,
		type MonoFont,
		BracketOptions,
		type BracketOption,
		OverlayPages,
		type OverlayPage
	} from '$lib/storage.svelte';
	import { loadSoldierPlayoffs2026, loadDemoPlayoffs2026 } from '$lib/preset-data.svelte';
	import { slide } from 'svelte/transition';
	import * as _ from 'underscore';
	import icon_soldier from '$lib/assets/icon_soldier.png';
	import icon_demo from '$lib/assets/icon_demo.png';
	import {
		clearPicksAndBans,
		clearTimer,
		initializeWebSocket,
		wsState
	} from '$lib/websocket.svelte';
	import RadioInputs from '$lib/components/controls/RadioInputs.svelte';

	const fonts: Settings['font'][] = [...Fonts];
	const monoFonts: Settings['monoFont'][] = [...MonoFonts];

	if (settings.current.useWebSocket) {
		initializeWebSocket();
	}

	let test = '';
</script>

<span class="self-center">sooft controls</span>

<!-- links -->
<div class="absolute right-4 flex flex-row-reverse gap-1">
	<a class="opacity-50 hover:opacity-100" href="https://ko-fi.com/mkgzr" target="_blank">
		<img class="size-8" src={kofi_symbol} alt="" />
	</a>
	<a class="opacity-50 hover:opacity-100" href="https://ko-fi.com/itsmmarc" target="_blank">
		<img class="size-8" src={kofi_symbol} alt="" />
	</a>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<a class="opacity-50 hover:opacity-100" href="https://github.com/itsmmarc/sooft" target="_blank">
		<span class="icon-[mdi--github] size-8 text-white"></span>
	</a>
</div>

<!-- presets -->
<div class="relative m-2 flex w-full max-w-lg justify-center gap-4 self-center">
	<button
		class="button-remove"
		onclick={() => {
			fullReset();
			clearTimer();
			clearPicksAndBans();
		}}>full settings reset</button
	>
	<button class="hover:mix-blend-soft-light" onclick={() => loadSoldierPlayoffs2026()}>
		<img
			src={icon_soldier}
			class="size-12"
			aria-label="load soldier playoffs 2026"
			alt="load soldier playoffs 2026"
		/>
	</button>
	<button class="hover:mix-blend-soft-light" onclick={() => loadDemoPlayoffs2026()}>
		<img
			src={icon_demo}
			class="size-12"
			aria-label="load soldier playoffs 2026"
			alt="load soldier playoffs 2026"
		/>
	</button>
</div>
<div class="relative m-2 flex w-full max-w-lg justify-center gap-4 self-center">
	<button class="button-remove" onclick={() => clearTimer()}>clear timers and checkpoints</button>
	<button class="button-remove" onclick={() => clearPicksAndBans()}>clear map picks and bans</button
	>
</div>

<!-- items -->
<Accordion title="items">
	<PlayerInput />
	<MapInput />
	<ItemInput placeholder="add stage" item="stages" />
</Accordion>

<!-- settings -->
<Accordion title="settings">
	<button
		class="button-remove absolute top-0 right-0"
		onclick={() => {
			settings.current = defaultSettings;
		}}>reset to default</button
	>
	<span>page</span>
	<RadioInputs name="pages" opts={[...OverlayPages]} bind:value={settings.current.overlayPage} />
	<span>font</span>
	<RadioInputs name="fonts" opts={[...Fonts]} bind:value={settings.current.font} />
	<span>mono font</span>
	<RadioInputs name="mono fonts" opts={[...MonoFonts]} bind:value={settings.current.monoFont} />

	<!-- color -->
	<span>theme</span>
	<div class="flex gap-2">
		<div
			class="size-12 border-4 border-ctp-text bg-ctp-lavender"
			style:filter={getFiltersStyle()}
		></div>
		<div class="flex flex-col justify-evenly">
			<RangeInput setting="hue" max={360} />
			<RangeInput setting="saturation" max={200} />
		</div>
	</div>

	<hr class="mb-0.5 h-0.5 w-full border-none bg-obs-padding" />

	<label transition:slide|global>
		<input
			class="peer size-4 accent-ctp-lavender"
			type="checkbox"
			bind:checked={settings.current.useWebSocket}
			onchange={() => initializeWebSocket()}
		/>
		<span class="peer-not-checked:text-ctp-text/50">use WebSocket</span>
	</label>
	{#if settings.current.useWebSocket}
		<div class="flex gap-2">
			<label for="input-websocket">token: </label>
			<input
				type="password"
				class="input w-60"
				id="input-websocket"
				value={settings.current.webSocketToken}
				onchange={(e) => {
					let target = e.target as HTMLInputElement;
					settings.current.webSocketToken = target.value;
				}}
			/>
			<button
				class="button button-unselected hover:button-selected"
				onclick={() => initializeWebSocket()}>connect</button
			>
		</div>
	{/if}
	<!-- <div class="flex gap-2">
		<p>status:</p>
		<span
			class={wsState.current.state === 0
				? 'text-yellow-200'
				: wsState.current.state === 1
					? 'text-green-300'
					: wsState.current.state === 2
						? 'text-red-200'
						: wsState.current.state === 3
							? 'text-black'
							: ''}
		>
			{wsState.current.state === 0
				? 'opening...'
				: wsState.current.state === 1
					? 'connected'
					: wsState.current.state === 2
						? 'closing...'
						: wsState.current.state === 3
							? 'closed'
							: ''}
		</span>
		<span class="italic opacity-50">{wsState.current.state}</span>
	</div> -->

	<Checkbox desc="use moving background" setting="enableMovingBG" />
	<Checkbox desc="use short map names" setting="useShortMapNames" />
	<Checkbox desc="use single POV" setting="enableSinglePOV" />
	{#if !settings.current.enableSinglePOV}
		<Checkbox desc="show POV guide" setting="enablePOVGuide" />
		<Checkbox desc="use gradient" setting="enableGradient" />
		{#if settings.current.enableGradient}
			<Checkbox desc="use red & blue team colors" setting="enableTeamColors" />
		{/if}
	{/if}
	<Checkbox desc="use player PRs" setting="enablePRs" />
	<Checkbox desc="use avatars" setting="enableAvatars" />
	<Checkbox desc="use tags" setting="enableTags" />
</Accordion>

<!-- overlay -->
<div class="relative mb-2 flex w-full max-w-lg justify-center gap-1 self-center">
	<span class="absolute left-0">best of</span>
	<RadioInputs
		name="best of"
		opts={[1, 3, 5, 7, 9]}
		bind:value={overlay.current.bestOf}
		log={true}
	/>
</div>

<!-- players -->
<div class="flex w-full max-w-lg justify-evenly self-center">
	<Player side="left" />
	<hr class="mx-2 mb-2 h-32 w-1 self-end border-none bg-obs-padding" />
	<Player side="right" />
</div>

<div class="max-w-lg self-center">
	<!-- maps -->

	<span>map</span>
	<RadioInputs
		name="maps"
		opts={Object.values(items.current.maps)}
		labelkey={settings.current.useShortMapNames ? 'shortName' : 'fileName'}
		bind:value={overlay.current.map}
		log={true}
	/>

	<!-- classes -->
	<span>class</span>
	<RadioInputs name="classes" opts={[...TFClasses]} bind:value={overlay.current.class} />

	<!-- bracket -->
	<span>bracket display</span>
	<RadioInputs
		name="bracketdisplay"
		opts={[...BracketOptions]}
		bind:value={overlay.current.bracket}
	/>

	<!-- stages -->
	<div class="flex justify-between">
		<span>stage</span>
		<button
			class="button-remove"
			onclick={() => {
				items.current.stages = defaultStages;
			}}>reset to default</button
		>
	</div>
	<RadioInputs name="stages" opts={[...items.current.stages]} bind:value={overlay.current.stage} />
</div>
