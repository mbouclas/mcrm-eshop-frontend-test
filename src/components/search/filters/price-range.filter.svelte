<script lang="ts">
    import Skeleton from '@components/skeleton.loader.svelte';
    import type {Results} from "@models/products.model";
    import {
        addFilterAction,
        appliedFiltersStore,
        removeFilterAction,
        removeFilterValueAction,
        searchStore, searchWithFiltersStore, setModalShownAction
    } from "@stores/search.store";
    import type {IPropertyEs} from "@models/products.model";
    import {filterIsApplied} from "@helpers/validation";
    import {onMount} from "svelte";
    export let type: 'main'|'modal' = "main";
    let res = [],
        loading = true,
        priceRanges: Results[] = [],
        appliedFilters = [],
        priceFilters = [];

    searchWithFiltersStore.subscribe(state => {
        if (!state.searchResults.aggregations || !Array.isArray(state.searchResults.aggregations) || state.searchResults.aggregations.length === 0) {
            return;
        }

        const found = state.searchResults.aggregations.find(a => a.key === 'price');
        if (!found || !found.results) {return;}

        loading = false;
        priceRanges = found.results.map(r => {
            r['checked'] = filterIsApplied(state.appliedFilters, r);
            return r;
        });
    });

    appliedFiltersStore.subscribe(state => {
        appliedFilters = state;
        priceFilters = [];// reset after every removal of filter
        const existing = appliedFilters.filter(f => {
            const key = Object.keys(f)[0];
            return key === 'price';
        }).map(f => {
            const key = Object.keys(f)[0];
            return f[key];
        });

        if (Array.isArray(existing) && existing.length > 0){
            priceFilters = existing[0];
        }
    });

    onMount(() => {

    })

    function filter(item: IPropertyEs) {
        if (item['checked']) {
            removeFilterValueAction('price', item.slug);
            removeFilterAction('page');
            if (type === 'modal'){
                setModalShownAction(false);
            }
            return;
        }
        else {
            addFilterAction({price: item.slug} as any);
            removeFilterAction('page');
            if (type === 'modal'){
                setModalShownAction(false);
            }
        }
    }

    function formatRange(rangeStr, suffix = '', prefix = '') {
        const parts = rangeStr.split('-');
        const ret = [];

        if (parts[0] === '*') {
            ret.push(`${prefix}0${suffix}`);
        } else {
            ret.push(`${prefix}${parseInt(parts[0])}${suffix}`);
        }

        if (parts[1] === '*') {
            ret.push('')
        } else {
            ret.push(`${prefix}${parseInt(parts[1])}${suffix}`);
        }

        return ret.join(' - ');
    }
</script>


<fieldset>
    <legend class="block text-sm font-medium text-gray-900 ">Price</legend>
    <div class="border-b  border-gray-200 mb-4 my-2"></div>
    <div class="space-y-3 pt-6">
        {#if loading}
            <Skeleton />
        {/if}
        {#each priceRanges as item, idx}
            <div class="flex items-center">
                <input on:change={filter.bind(this, item)} bind:checked={item['checked']}
                       id={`price-${idx}`} name="price[]" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <label
                        for={`price-${idx}`} class="ml-3 text-sm text-gray-600">{formatRange(item.key, '', '€')} ({item.doc_count})</label>
            </div>
        {/each}
    </div>
</fieldset>
