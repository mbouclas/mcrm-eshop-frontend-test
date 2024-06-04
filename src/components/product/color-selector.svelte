<script lang="ts">
    import type {IProductColorForSelector} from "@models/products.model";
    import {cloudinaryRawSettings, cloudinarySrcSet, optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
    import {createEventDispatcher, onMount} from 'svelte';
    import {productStore, setColorAction} from "@stores/product.store";
    import {appliedFiltersStore} from "@stores/search.store";
    import {appConfig} from "@stores/http.store";
    import {scrollToEl} from "@helpers/general";
    import {moneyFormat} from "@helpers/money-format.ts";
    const dispatch = createEventDispatcher();

    export let colors: IProductColorForSelector[] = [];
    export let mode: 'image'|'picture' = 'image',
    withLabels = false;
    export let size: 'small'|'normal'|'large' = 'small';
    export let withColors = true;
    let outerRing = 6,
        innerRing = 3,
    selectedColor = colors[0];
    export let targetImage: string;
    let container: Element|null,
    target: Element|null,
    mask: Element|null;

    switch (size) {
        case "small": outerRing = 6; innerRing = 3;
        break;
        case "normal": outerRing = 8; innerRing = 6;
        break;
        case "large": outerRing = 22; innerRing = 16;
        break;
    }

    appliedFiltersStore.subscribe(filters => {
        const filter = filters.find(f => {
            const key = Object.keys(f)[0];
            return key === 'colors';
        })

        if (!filter) {return;}

        // no point trying to set a default color when there are multiple colors as filters
        if (Array.isArray(filter) && filter.length > 1) {

            return;
        }

        // find the color

        selectedColor = colors.find(c => {
            return c.slug === filter.colors[0]
        });

        if (!selectedColor) {
            return;
        }

        selectVariant(selectedColor);
    });

    productStore.subscribe(state => {
        // console.log(state)
    })

    onMount(() => {
        if (withColors) {
            setColorAction(selectedColor);
        }

        container = document.querySelector(targetImage);

        if (!container) {
            return;
        }

        target = container.querySelector('.product-image');
        mask = container.querySelector('.loading-mask');

        if (typeof window === 'undefined') {
            return;
        }

        const el = (mode === 'image') ? target : target.querySelector('img');

        el.addEventListener("load", event => {
            if (el && el.complete && el.naturalHeight !== 0) {
                mask.classList.add('hidden');
            }
        });

        el.addEventListener("error", event => {
            el.src = appConfig.defaultNoImage
            mask.classList.add('hidden');
        });
    })


    function selectVariant(color: IProductColorForSelector, attempt = 1) {
        if (mode === 'picture') {
            document.querySelector('.price').innerHTML = moneyFormat(color.price);
        }

        if (!container && attempt < 3) {
            // retry after 100ms
            setTimeout(() => {
                container = document.querySelector(targetImage);
                target = container.querySelector('.product-image');
                mask = container.querySelector('.loading-mask');

                selectVariant(color, attempt + 1);
            }, 100);

            return;
        }


        if (!target) {
            return;
        }

        // In case the DOM is not ready, retry
        if (!target && attempt < 3) {
            // retry after 100ms
            setTimeout(() => {
                target = container.querySelector('.product-image');
                mask = container.querySelector('.loading-mask');
                selectVariant(color, attempt + 1);
            }, 100);

            return;
        }

        if (mask) {
            mask.classList.remove('hidden');
        }

        dispatch('color.selected', color);
        setColorAction(color);
        selectedColor = color;

        const clickedEl = container.querySelector(`[data-color="${color.slug}"]`);

        container.parentElement.querySelectorAll('.color-option').forEach(el => {
            el.classList.remove('ring-2', 'ring-black', 'ring-offset-2');
        });


        if (clickedEl) {
            clickedEl.classList.add('ring-2', 'ring-black', 'ring-offset-2');
        }




        if (mode === 'image') {
            target['src'] = optimizeCloudinaryImage(color.variant.image);
            return;
        }

        //srcset
        if (!color.variant.image) {
            mask.classList.add('hidden');
            return
        }

        const srcSet = cloudinarySrcSet(color.variant.image);
        target.querySelector('img').src = srcSet.original;
        const sources = target.querySelectorAll('source');
        sources.forEach((node, idx) => {
            const parts = node.srcset.split(' ');
            parts[0] = srcSet.copies[idx].url;
            node.srcset = parts.join(' ');

        });

        if (mode === 'picture') {
            scrollToEl(null);
        }
    }

</script>
{#if withLabels && selectedColor}
    <div class="my-2">
    <h3 class="text-sm text-gray-600"><span class="font-semibold">Color:</span> {selectedColor.name}</h3>
    </div>
{/if}
{#if withColors}
<div class="w-full grid grid-cols-5 px-3 gap-2 py-2">
    {#each colors as color}
        <a href="#" title={color.name}
           on:click|preventDefault={selectVariant.bind(this, color)}>
            <div data-color={color.slug}
                    class={`color-option h-${outerRing} w-${outerRing} border border-[${['#ffffff', '#faeee0'].indexOf(color.color) !==  -1 ? '#000' : color.color}] flex rounded-full items-center justify-center`}
                 style={`border-color:${['#ffffff', '#faeee0'].indexOf(color.color) !==  -1 ? '#000' : color.color}`}>
                {#if color.image}
                   <img src={cloudinaryRawSettings(color.image, 'w_30,h_30,c_scale,dpr_auto,f_auto')} alt={color.name} width="30" height="30" class={` rounded-full`} />
                {:else}
                    <div class={`h-${innerRing} w-${innerRing} rounded-full`} style={`background-color:${color.color}`}></div>
                {/if}
            </div>
        </a>
    {/each}
</div>
    {/if}
