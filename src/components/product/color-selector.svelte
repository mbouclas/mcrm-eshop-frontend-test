<script lang="ts">
    import type {IProductColorForSelector} from "@models/products.model";
    import {cloudinarySrcSet, optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
    import {createEventDispatcher, onMount} from 'svelte';
    import {setColorAction} from "@stores/product.store";
    const dispatch = createEventDispatcher();

    export let colors: IProductColorForSelector[] = [];
    export let mode: 'image'|'picture' = 'image',
    withLabels = false;
    export let size: 'small'|'normal'|'large' = 'small';
    let outerRing = 6,
        innerRing = 3,
    selectedColor = colors[0];

    switch (size) {
        case "small": outerRing = 6; innerRing = 3;
        break;
        case "normal": outerRing = 8; innerRing = 6;
        break;
        case "large": outerRing = 22; innerRing = 16;
        break;
    }

    onMount(() => {
        setColorAction(selectedColor);
    })

    export let targetImage: string;
    function selectVariant(color: IProductColorForSelector) {
        const target = document.querySelector(targetImage);
        if (!target) {return;}

        dispatch('color.selected', color);
        setColorAction(color);
        selectedColor = color;

        if (mode === 'image') {
            target['src'] = optimizeCloudinaryImage(color.variant.image);
            return;
        }

        //srcset
        const srcSet = cloudinarySrcSet(color.variant.image);
        target.querySelector('img').src = srcSet.original;
        const sources = target.querySelectorAll('source');
        sources.forEach((node, idx) => {
            const parts = node.srcset.split(' ');
            parts[0] = srcSet.copies[idx].url;
            node.srcset = parts.join(' ');

        })
    }

</script>
{#if withLabels && selectedColor}
    <div class="my-2">
    <h3 class="text-sm text-gray-600"><span class="font-semibold">Color:</span> {selectedColor.name}</h3>
    </div>
{/if}
<div class="w-full grid grid-cols-5 px-3 gap-2 py-2">
    {#each colors as color}
        <a href="#" title={color.name}
            on:click|preventDefault={selectVariant.bind(this, color)}>
            <div class={`h-${outerRing} w-${outerRing} border border-[${color.color}] flex rounded-full items-center justify-center`}
                 style={`border-color:${color.color}`}>
                {#if color.image}
                    <div class={`h-${innerRing} w-${innerRing} rounded-full`} style={`background:url('${color.image}')`}></div>
                {:else}
                    <div class={`h-${innerRing} w-${innerRing} rounded-full`} style={`background-color:${color.color}`}></div>
                {/if}
            </div>
        </a>
    {/each}
</div>
