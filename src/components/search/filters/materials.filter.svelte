<script lang="ts">
    import Skeleton from '@components/skeleton.loader.svelte';
    import {
        addFilterAction,
        appliedFiltersStore,
        removeFilterValueAction,
        searchWithPropertiesStore
    } from "@stores/search.store";
    import type {IPropertyEs} from "@models/products.model";
    import {filterIsApplied} from "@helpers/validation";

    let res = [];
    let loading = true,
        appliedFilters = [];

    appliedFiltersStore.subscribe(state => {
        appliedFilters = state;

    });

    searchWithPropertiesStore.subscribe(state => {
        if (state.properties.materials.length === 0) {
            return;
        }

        if (!state.searchResults.aggregations || !Array.isArray(state.searchResults.aggregations)) {
            return;
        }

        const c = state.searchResults.aggregations.find(a => a.key === 'material');

        if (!c || !Array.isArray(c.results)) {return;}

        loading = false;
        res = c.results.map(r => {
            r['checked'] = filterIsApplied(appliedFilters, r);
            return r;
        });
    });



    async function filter(item: IPropertyEs) {
        if (item['checked']) {
            removeFilterValueAction('material', item.slug);
            return;
        }
        else {
            addFilterAction({material: item.slug} as any)
        }

    }
</script>
{#if loading}
    <Skeleton />
    {/if}
<fieldset>
    <legend class="block text-sm font-medium text-gray-900">Material</legend>
    <div class="space-y-3 pt-6 h-[400px] overflow-y-auto">
        {#each res as item, idx}
        <div class="flex items-center">
            <input on:change={filter.bind(this, item)} bind:checked={item['checked']}
                    id={`material-${idx}`} name="category[]" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
            <label
                    for={`material-${idx}`} class="ml-3 text-sm text-gray-600">{item.key} ({item.doc_count})</label>
        </div>
        {/each}

    </div>
</fieldset>
