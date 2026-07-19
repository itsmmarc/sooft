<script lang="ts">
	import { fade } from 'svelte/transition';

	type Props = { code: string; styleclass?: string };
	let { code, styleclass }: Props = $props();
</script>

<span in:fade class="fi fi-{code} {styleclass}"></span>
