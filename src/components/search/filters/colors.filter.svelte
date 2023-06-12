<script lang="ts">
    import Skeleton from '@components/skeleton.loader.svelte';
    import {
        addFilterAction, removeFilterAction,
        removeFilterValueAction,
        searchWithPropertiesStore, setModalShownAction
    } from "@stores/search.store";
    import {optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
    import type {IPropertyEs} from "@models/products.model";
    export let type: 'main'|'modal' = "main";
    let res = [],
    loading = true,
        appliedFilters = [],
        colorFilters = [];


    searchWithPropertiesStore.subscribe(state => {
        appliedFilters = state.appliedFilters;

        colorFilters = [];// reset after every removal of filter
        const existing = appliedFilters.filter(f => {
            const key = Object.keys(f)[0];
            return key === 'colors';
        }).map(f => {
            const key = Object.keys(f)[0];
            return f[key];
        });

        if (Array.isArray(existing) && existing.length > 0){
            colorFilters = existing[0];
        }


        if (state.properties.colors.length === 0) {
            return;
        }

        if (!state.searchResults.aggregations || !Array.isArray(state.searchResults.aggregations)) {
            return;
        }

        const c = state.searchResults.aggregations.find(a => a.key === 'colors');
        if (!c || !Array.isArray(c.results)) {return;}

        loading = false;

        res = c.results.map(res => {
            const color = state.properties.colors.find(c => c.code === res.key);
            if (color) {
                return {
                    ...res,
                    ...color
                };
            }

            return res;
        });

        if (colorFilters.length > 0){
            colorFilters = colorFilters
                .filter(v => typeof v === 'string')
                .map((f, idx) => {
                return state.properties.colors.find(v => v.slug === f);
            });

        }


    });

    async function filter(item: IPropertyEs) {
        addFilterAction({colors: item.slug}  as any);
        removeFilterAction('page');
        if (type === 'modal'){
            setModalShownAction(false);
        }

    }

    function removeFilter(filter: IPropertyEs) {
        removeFilterValueAction('colors', filter.slug);
        removeFilterAction('page');
        if (type === 'modal'){
            setModalShownAction(false);
        }

    }

</script>

{#if colorFilters.length > 0}
<div class="bg-gray-100">
    <div class="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
        <h3 class="text-sm font-medium text-gray-500">Filters</h3>

        <div aria-hidden="true" class="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"></div>

        <div class="mt-2 sm:ml-4 sm:mt-0">
            <div class="-m-1 flex flex-wrap items-center">
                {#each colorFilters as filter}
                    {#if filter && filter.name}
                  <span class="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-sm font-medium text-gray-900">
                      <span>{filter.name}</span>
                      <button on:click={removeFilter(filter)}
                              type="button" class="ml-1 inline-flex h-4 w-4 flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-500">
                        <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7"></path>
                        </svg>
                      </button>
                    </span>
                        {/if}
                {/each}
            </div>
        </div>

    </div>
</div>
{/if}

    <fieldset>
        <legend class="block text-sm font-medium text-gray-900">Color</legend>
        <div class="border-b  border-gray-200 mb-4 my-2"></div>
        <div class="space-y-3 pt-6 max-h-[400px] overflow-y-auto">
            {#if loading}
                <Skeleton />
            {/if}
        <div class="grid grid-cols-5 gap-2">
            {#each res as item}
            <a href="#" on:click|preventDefault={filter.bind(this, item)} title={`${item.name} (${item.doc_count})`}>
                {#if !item.image}
                    <div class={`h-6 w-6 border border-[${item.color === '#ffffff' ? '#000' : item.color}] flex rounded-full items-center justify-center`}
                         style={`border-color:${item.color === '#ffffff' ? '#000' : item.color}`}>
                        <div class={`h-3 w-3 rounded-full`} style={`background-color:${item.color}`}></div>
                    </div>
                {:else}
                    <div>
                        <img src={optimizeCloudinaryImage(item.image, 20, 20)} width="20" height="20" alt={item.name} class="rounded rounded-full" />
                    </div>
                {/if}
            </a>
            {/each}
        </div>
        </div>
    </fieldset>
