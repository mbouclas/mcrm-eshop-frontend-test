<script lang="ts">
    import Sidebar from "@components/sidebar.svelte";
    import Button from '@components/buttons.component.svelte';
    import {appliedFiltersStore, clearAllFiltersAction, modalStore, setModalShownAction} from "@stores/search.store";
    import ColorsList from "@components/search/filters/colors.filter.svelte";
    import TextFilter from '@components/search/filters/text.filter.svelte';
    import MaterialsList from "@components/search/filters/materials.filter.svelte";
    import PriceRange from "@components/search/filters/price-range.filter.svelte";
    import SortBy from '@components/search/sortby.svelte';
    import TotalResultCounter from "@components/search/total-results.svelte";
    let filterCount = 0;
    let modalIsShown = false;

    appliedFiltersStore.subscribe(state => {
        filterCount = 0;
       state.forEach(filter => {
           const key = Object.keys(filter)[0];
           if (['page', 'categories', 'orderBy', 'way'].indexOf(key) !== -1) {
               return;
           }

           if (!Array.isArray(filter[key]) && ['page'].indexOf(key) !== -1) {
               return;
           }
           else if (!Array.isArray(filter[key])) {
               filterCount = filterCount + 1;
               return;
           }

           filterCount = filterCount + filter[key].length;
       });
    });


    function toggle() {
        modalIsShown = !modalIsShown;
        setModalShownAction(modalIsShown, 'filters');
    }

    modalStore.subscribe(state => {
        if (state.id !== 'filters') {
            return;
        }

        modalIsShown = state.shown;
    });


    function clear() {
        clearAllFiltersAction();
    }
</script>

<Sidebar title="filters" id="filters">

    {#if filterCount > 0}
    <div class="pb-6 ">
    <TotalResultCounter />
    </div>
        {/if}
    <div class=" ">
    <SortBy type="modal" />
    </div>
    <div class="border-b  border-gray-200 mb-4 my-2"></div>
    <div class="py-6 ">
    <TextFilter />
    </div>
    <slot name="categories"></slot>

    <div class="py-6 ">
        <PriceRange type="modal" />
    </div>

    <div class="py-6">
        <ColorsList type="modal"  />
    </div>

    <div class="py-6">
        <MaterialsList type="modal"  />
    </div>
    <div class="h-14"></div>


</Sidebar>
{#if filterCount > 0 && modalIsShown}
    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
        <div class="flex items-center justify-center mx-auto mb-1">
            <div class="pt-2">
                <button on:click={toggle} type="button" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    <TotalResultCounter />
                </button>
            </div>
        </div>
    </div>
{/if}
{#if !modalIsShown}
<div class="fixed  z-20 bottom-28 right-2 h-12 px-4 py-3 rounded-xl bg-sky text-white/90">
    <button  class="flex" on:click={toggle}>
        <svg class="h-5 w-5 mr-2"
             xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>
        <span>Filter - Sort</span>
    </button>
</div>
    {/if}
