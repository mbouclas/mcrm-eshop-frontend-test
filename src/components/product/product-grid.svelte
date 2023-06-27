<script lang="ts">
import GridItem from '@components/product/product-grid-item.svelte';
import {searchStore} from "@stores/search.store";
import type {Data} from "@models/products.model";
let results: Data[] = [];
searchStore.subscribe(state => {
    results = [];
    // timeout needed to kill the old components to refresh the state of each item
 setTimeout(() => {
     results = state.data as Data[];
    });
   // results = state.data as Data[];
});
</script>
<div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:grid-cols-3 xl:grid-cols-4">
    {#each results as item}
        <GridItem item={item} />
    {/each}
</div>
