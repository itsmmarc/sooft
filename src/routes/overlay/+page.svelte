<script lang="ts">
	import { settings, overlay } from '$lib/storage.svelte';
</script>

<!-- top bar -->
<div class="flex h-32 w-full justify-between border-b-4 border-ctp-lavender/50 p-4">
	{@render OverlayPlayer('leftPlayer')}
	{@render OverlayPlayer('rightPlayer')}
</div>

<!-- POVs -->
{#if !settings.current.enableSinglePOV}
	<div class="flex w-full border-b-4 border-ctp-lavender/50">
		<div
			class="aspect-video w-full
  {settings.current.enablePOVGuide
				? 'border-r-2 border-dashed border-ctp-lavender/50 bg-ctp-lavender/25'
				: ''}"
		></div>
		<div
			class="aspect-video w-full
  {settings.current.enablePOVGuide
				? 'border-l-2 border-dashed border-ctp-lavender/50 bg-ctp-lavender/25'
				: ''}"
		></div>
	</div>
{/if}

<!-- bottom bar -->
<div class="flex h-16 w-full justify-between">
	<!-- stage -->
	<div
		class="relative -left-4 flex h-full -skew-x-30 items-center justify-end rounded-br-xl border-r-4 border-b-4 border-ctp-lavender/50 bg-ctp-lavender/25
    {overlay.current.stage === '' ? 'opacity-0' : ''}"
	>
		<span class="relative left-2 skew-x-30 pr-8 pl-6 text-3xl text-ctp-text/75"
			>{overlay.current.stage}</span
		>
	</div>

	<!-- map -->
	<div
		class="relative -right-4 flex h-full skew-x-30 items-center justify-end rounded-bl-xl border-b-4 border-l-4 border-ctp-lavender/50 bg-ctp-lavender/25
    {overlay.current.map === '' ? 'opacity-0' : ''}"
	>
		<span class="relative right-2 -skew-x-30 pr-6 pl-8 text-3xl text-ctp-text/75"
			>{overlay.current.map}</span
		>
	</div>
</div>

{#snippet OverlayPlayer(sideKey: 'leftPlayer' | 'rightPlayer')}
	<div class="flex h-full gap-4 {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}">
		<!-- flag -->
		<span class="fi fi-{overlay.current[sideKey].flag} flex h-fit w-fit rounded-xl text-[6rem]"
		></span>
		<div class="flex flex-col {sideKey === 'rightPlayer' ? 'items-end' : 'items-start'}">
			<div class="mb-3 flex gap-2">
				<!-- tag -->
				{#if settings.current.enableTags}
					<span class="text-4xl text-ctp-text/75">{overlay.current[sideKey].tag}</span>
				{/if}
				<!-- name -->
				<span class="text-4xl font-bold">{overlay.current[sideKey].name}</span>
			</div>
			<!-- score -->
			<div
				class="flex gap-2 font-courier-prime text-ctp-text/75
      {sideKey === 'rightPlayer' ? 'flex-row-reverse' : ''}"
			>
				{#each { length: overlay.current[sideKey].score }}
					<span
						class="size-8 border-4 border-ctp-text bg-ctp-lavender transition-all duration-1000 starting:border-ctp-text/50 starting:bg-ctp-lavender/0"
					></span>
				{/each}
				{#each { length: (overlay.current.bestOf + 1) / 2 - overlay.current[sideKey].score }}
					<span class="size-8 border-4 border-ctp-text/50"></span>
				{/each}
				<!-- PRs -->
				{#if settings.current.enablePRs && overlay.current[sideKey].pr !== ''}
					<div class="flex items-center gap-2">
						<span class="text-2xl">pr</span>
						<span class="text-3xl">{overlay.current[sideKey].pr}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/snippet}
