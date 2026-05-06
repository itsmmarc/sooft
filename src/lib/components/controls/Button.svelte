<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		selected: boolean;
		onclick: () => void;
		oncontextmenu?: (() => void) | null;
	};

	let { children, selected, onclick, oncontextmenu = null }: Props = $props();
</script>

<button
	class="button {selected ? 'button-selected' : 'button-unselected'}"
	{onclick}
	oncontextmenu={(e) => {
		if (oncontextmenu !== null) {
			e.preventDefault();
			oncontextmenu();
		}
	}}
>
	{@render children()}
</button>
