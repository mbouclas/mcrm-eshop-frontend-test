<script lang="ts">
    import {
        appliedFiltersStore, clearAllFiltersAction,

        searchWithFiltersStore, setFiltersAction, setInitialFiltersAction, setInitialSearch, setModalShownAction,
        setPropertiesAction,
        setSearchAction, setSortAction, sortWithFilters
    } from "@stores/search.store";
    import { onMount } from 'svelte';
    import Grid from '@components/product/product-grid.svelte';
    import SortBy from '@components/search/sortby.svelte';
    import {SearchService} from "@services/search.service";
    import type {IPropertyEs} from "@models/products.model";
    import {loadFiltersFromUrl, scrollToEl, setUrl} from "@helpers/general";


    const searchService = new SearchService();
    export let appliedFilters = [];
    export let colors: IPropertyEs;
    export let materials: IPropertyEs;
    let showSlotContent = true,
        initialState = true,
        initialFilter = true,
        filterCount = 0,
        modalIsShown = false,
        previousSortState = JSON.stringify({});

    appliedFiltersStore.subscribe(async state => {
        if (initialState) {return;}
        initialFilter = false;

        setSearchAction(await searchService.search(state));
        setInitialSearch(false);
    });

    appliedFiltersStore.subscribe(state => {
        filterCount = 0;

        state
            .filter(filter => {
                const key = Object.keys(filter)[0];

                return ['page', 'sort', 'way', 'categories'].indexOf(key) === -1;
            })
            .forEach(filter => {
            const key = Object.keys(filter)[0];

            if (!Array.isArray(filter[key]) && ['page', 'sort', 'way'].indexOf(key) !== -1) {
                return;
            }
            else if (!Array.isArray(filter[key])) {
                filterCount = filterCount + 1;
                return;
            }

            filterCount = filterCount + filter[key].length;
        });
    });

    /**
     * React only when a filter was applied
     */
    searchWithFiltersStore.subscribe(async state => {
        if (state.searchResults.initialSearch){
            return;
        }

        showSlotContent = false;
        scrollToEl(null);
        // set query params
        setUrl(state.appliedFilters)
    });

    sortWithFilters.subscribe(async state => {
        const currentSortState = JSON.stringify(state.sort);
        if (previousSortState === currentSortState) {return;}

        setSearchAction(await searchService.search(state.filters, state.sort));
        setInitialSearch(false);
        previousSortState = currentSortState;

        scrollToEl(null);
        // set query params
        setUrl([...state.filters, ...[{sort: state.sort.sort}, {way: state.sort.way}]]);
    });

    onMount(async () => {
        const filtersFromUrl = loadFiltersFromUrl(location.search[0] === '?' ? location.search.substring(1) : location.search);

        setPropertiesAction('colors', colors);
        setPropertiesAction('materials', materials);
        if (filtersFromUrl.length > 0) {
            initialFilter = false;
            initialState = false;
            setInitialSearch(false);
            setFiltersAction(filtersFromUrl);
        }
        else {
            setInitialFiltersAction(appliedFilters);
            setSearchAction(await searchService.search(appliedFilters), true);
        }

        const foundSort = filtersFromUrl.find(f => {
            const key = Object.keys(f)[0];
            return key === 'sort';
        });

        const foundWay = filtersFromUrl.find(f => {
            const key = Object.keys(f)[0];
            return key === 'way';
        });

        setSortAction({sort: foundSort, way: foundWay});

        initialState = false;
    });

    function toggle() {
        setModalShownAction(!modalIsShown, 'filters');
    }

    function clear() {
        clearAllFiltersAction();
    }

</script>
<section class="grid grid-cols-2 mb-6">
    <div class=" ">
        <div class="block lg:hidden">
            <button type="button" on:click={toggle}
                    class="group flex items-center font-medium text-gray-700 ">
                <svg class="mr-2 h-5 w-5 flex-none text-accent group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
                </svg>
                {#if filterCount > 0}
                    {filterCount}
                {/if}
                Filters
            </button>
        </div>
        {#if filterCount > 0}
        <div class="hidden lg:block">
            <div class="flex w-full justify-start">
            <div type="button"
                    class="group flex items-center font-medium text-gray-700 ">
                <svg class="mr-2 h-5 w-5 flex-none text-accent group-hover:text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z" clip-rule="evenodd" />
                </svg>
                {#if filterCount > 0}
                    {filterCount}
                {/if}
                Filters
            </div>

            <div class="pl-6">

                <button on:click={clear} type="button"  class="text-gray-500">Clear all</button>

            </div>
            </div>
        </div>
                {/if}
    </div>

    <div class=" ">
        <div class="flex w-full justify-end">
            <div class="grid grid-cols-2 hidden sm:block">

            <SortBy />
            </div>
        </div>
    </div>

</section>

{#if showSlotContent}
<slot></slot>
    {:else}

    <Grid />

{/if}
