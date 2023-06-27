<script lang="ts">
    import type {IProductModel} from "@models/products.model";

    export let item: IProductModel;
</script>
<ul role="list">
    {#if item['weight']}
        <li>Weight: {item.weight/100}kg</li>
    {/if}
    {#if item['width']}
        <li>Width: {item.width}cm</li>
    {/if}
    {#if item['height']}
        <li>Height: {item.height}cm</li>
    {/if}
    {#if item['length']}
        <li>Length: {item.length}cm</li>
    {/if}
    {#if item['diameter']}
        <li>Diameter: {item.diameter}cm</li>
    {/if}
    {#if item['pieces']}
        <li>Pieces in box: {item.pieces}</li>
    {/if}
</ul>
