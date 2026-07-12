<script lang="ts">
	import { overlay } from '$lib/storage.svelte';
	import _ from 'underscore';

	type Props = {
		opts: any[];
		labelkey?: string;
		name: string;
		value: any;
		log?: boolean;
	};
	let { opts, labelkey, name, log = false, value = $bindable() }: Props = $props();

	function onSelect() {
		if (log) {
			console.log(`${name}: ${value}`);
		}
	}
</script>

<div class="button-container">
	{#each opts as opt, i (i)}
		{@render RadioButton(opt)}
	{/each}
</div>

{#snippet RadioButton(opt: any)}
	{@const optlabel = labelkey && labelkey in opt ? opt[labelkey] : opt}
	<label
		class="button button-unselected flex cursor-pointer flex-col select-none has-checked:border-ctp-lavender-950 has-checked:bg-ctp-lavender
                {labelkey && _.isEqual(opt, value)
			? 'border-ctp-lavender-950 bg-ctp-lavender'
			: ''}"
	>
		<input
			type="radio"
			class="hidden"
			id={optlabel}
			{name}
			bind:group={value}
			value={opt}
			onchange={() => {
				onSelect();
			}}
		/>
		{optlabel === '' ? '✖' : optlabel}
	</label>
{/snippet}
