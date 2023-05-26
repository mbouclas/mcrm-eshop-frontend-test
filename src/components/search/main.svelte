<script lang="ts">
    import {
        appliedFiltersStore,
        propertiesStore,
        searchStore, searchWithFiltersStore,
        setPropertiesAction,
        setSearchAction
    } from "@stores/search.store";
    import { onMount } from 'svelte';
    import Grid from '@components/product/product-grid.svelte';
    import {SearchService} from "@services/search.service";
    import type {IPropertyEs} from "@models/products.model";
    import {MD5, scrollToEl} from "@helpers/general";


    const searchService = new SearchService();
    export let appliedFilters = [];
    export let colors: IPropertyEs;
    export let materials: IPropertyEs;
    let showSlotContent = true,
        initialState = true,
    previousStateHash;
    searchStore.subscribe(state => {
        // console.log('In main Search', state);
    });

    propertiesStore.subscribe(state => {
        // console.log(state)
    })

    /**
     * React only when a filter was applied
     */
    searchWithFiltersStore.subscribe(async state => {
        const stateHash = MD5.hash(JSON.stringify(state));
        // If !previousStateHash, we're here for the first time
        if (initialState){
            return;
        }

        if (stateHash === previousStateHash) {
            return;
        }

        showSlotContent = false;
        previousStateHash = stateHash;
        setSearchAction(await searchService.search(state.appliedFilters));
        scrollToEl(null)
        // set query params
    })

    onMount(async () => {
        setPropertiesAction('colors', colors);
        setPropertiesAction('materials', materials);
        setSearchAction(await searchService.search());
        initialState = false;
       // detect any query params
        console.log('main search mounted')
    });


</script>
{#if showSlotContent}
<slot></slot>
    {:else}
    <Grid />

{/if}
