<script lang="ts">
	import { items, type Items } from '$lib/storage.svelte';

	type Props = {
		placeholder: string;
		item: keyof Items;
	};

	let { placeholder, item }: Props = $props();
</script>

<div>
	<input
		class="input"
		{placeholder}
		onkeypress={(e) => {
			if (e.key === 'Enter') {
				const value = (e.target as HTMLInputElement).value;

				if (item === 'flags' && value.length !== 2) return; // early return for flags
				(e.target as HTMLInputElement).value = '';
				if (items.current[item].includes(value)) return; // early return for dupes
				items.current[item].push(value);
			}
		}}
	/>
	<button
		class="button-remove"
		onclick={() => {
			items.current[item] = [];
		}}>remove all</button
	>
</div>
