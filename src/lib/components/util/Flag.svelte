<script lang="ts">
	import { fade } from 'svelte/transition';

	type Props = { code: string; class?: string };
	let { code, class: styleClass }: Props = $props();
</script>

<span in:fade class="fi fi-{code} {styleClass}"></span>
