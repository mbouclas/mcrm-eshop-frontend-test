<script lang="ts">
    import type {IProductColorForSelector} from "@models/products.model";

    export let colors: IProductColorForSelector[] = [];
    export let targetImage: string;
    function selectVariant(color: IProductColorForSelector) {
        const target = document.querySelector(targetImage);
        if (target) {
            target.src = color.variant.image;
        }
    }

</script>

<div class="w-full grid grid-cols-5 px-3 gap-2 py-2">
    {#each colors as color}
        <a href="#" title={color.name}
            on:click|preventDefault={selectVariant.bind(this, color)}>
            <div class={`h-6 w-6 border border-[${color.color}] flex rounded-full items-center justify-center`}
                 style={`border-color:${color.color}`}>
                {#if color.image}
                    <div class={`h-3 w-3 rounded-full`} style={`background:url('${color.image}')`}></div>
                {:else}
                    <div class={`h-3 w-3 rounded-full`} style={`background-color:${color.color}`}></div>
                {/if}
            </div>
        </a>
    {/each}
</div>
