<script lang="ts">
	let itemAIndex = $state(-1);
	let itemBIndex = $state(-1);

	type Props = {
		items: string[] | any[];
		labelkey?: string;
		pairitems?: boolean; // used for pairing players in a match
		onchange?: Function;
		debug?: boolean;
		class?: string;
	};
	let {
		items = $bindable(),
		labelkey,
		pairitems,
		onchange,
		debug,
		class: styleClass
	}: Props = $props();
</script>

<div class="bg-obs-background {styleClass}">
	<ul class="flex flex-col gap-2">
		{#each items as item, i (i)}
			<li
				class="bg-obs-padding {pairitems && i % 2 != 0 ? '-mt-2' : ''} "
				draggable={true}
				ondragstart={() => {
					itemAIndex = i;
				}}
				ondragenter={() => {
					itemBIndex = i;
				}}
				ondragend={() => (itemAIndex = -1)}
				ondragover={(e) => e.preventDefault()}
				ondrop={() => {
					if (debug) console.log(items);
					let temp = items[itemAIndex];

					items[itemAIndex] = items[itemBIndex];
					items[itemBIndex] = temp;
					items = [...items];

					if (onchange) onchange();
					if (debug) {
						console.log(items);
						console.log('-------------------------');
					}
				}}
			>
				{labelkey ? item[labelkey] : item}
			</li>
		{/each}
	</ul>
</div>
