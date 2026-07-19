<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = { height?: string; children: Snippet };
    let { height = "h-full", children }: Props = $props();
</script>

<span class="{height} inline-block align-middle"></span>
{@render children()}
