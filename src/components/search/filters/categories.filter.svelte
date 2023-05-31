<script lang="ts">
    import type {IProductCategoryEs} from "@models/products.model";
    import type {IAggregationBucket} from "@models/products.model";
    import CategoriesTree from '@components/search/filters/categories-tree.svelte';
    import {searchStore} from "@stores/search.store";
    export let categories: IProductCategoryEs[] = [],
        category: IProductCategoryEs,
    agg: IAggregationBucket;

    searchStore.subscribe(state => {
        if (!state.aggregations || !Array.isArray(state.aggregations) || state.aggregations.length === 0) {
            return;
        }

        agg = state.aggregations.find(a => a.key === 'categories');
    });

</script>
<fieldset>
    <legend class="block text-sm font-medium text-gray-900">Categories</legend>
    <div class="border-b  border-gray-200 mb-4 my-2"></div>
    <div class="space-y-3 pt-6">
        <CategoriesTree categories={categories} category={category} agg={agg} />
    </div>
</fieldset>
