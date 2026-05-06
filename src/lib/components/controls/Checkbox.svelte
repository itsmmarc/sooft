<script lang="ts">
	import { settings, type Settings } from '$lib/storage.svelte';

	type Props = {
		desc: string;
		setting: keyof Settings;
	};

	let { desc, setting }: Props = $props();
</script>

<label>
	<input
		class="size-4 accent-ctp-lavender"
		type="checkbox"
		bind:checked={settings.current[setting] as boolean}
	/>
	<span>{desc}</span>
</label>
