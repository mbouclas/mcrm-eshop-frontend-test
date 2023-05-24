<script lang="ts">
    import {
        appliedFiltersStore,
        propertiesStore,
        searchStore,
        setPropertiesAction,
        setSearchAction
    } from "@stores/search.store";
    import { onMount } from 'svelte';
    import {SearchService} from "@services/search.service";
    import type {IPropertyEs} from "@models/products.model";

    const searchService = new SearchService();
    export let appliedFilters = [];
    export let colors: IPropertyEs;
    export let materials: IPropertyEs;
    let test;
    searchStore.subscribe(state => {
        // console.log('In main Search', state);
    });

    propertiesStore.subscribe(state => {
        // console.log(state)
    })

    onMount(async () => {
        setPropertiesAction('colors', colors);
        setPropertiesAction('materials', materials);
        setSearchAction(await searchService.search());

       // detect any query params
        console.log('main search mounted')
    });

    appliedFiltersStore.subscribe(async state => {
        console.log('Filters changed, searching')
        setSearchAction(await searchService.search(state));
    })
</script>
