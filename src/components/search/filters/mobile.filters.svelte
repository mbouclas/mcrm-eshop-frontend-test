<script lang="ts">
    import Modal from '@components/full-screen-modal.svelte';
    import {appliedFiltersStore, clearAllFiltersAction, setModalShownAction} from "@stores/search.store";
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
        setModalShownAction(!modalIsShown);
    }

    function clear() {
        clearAllFiltersAction();
    }
</script>
<Modal title="filters">
    <div class="pb-6 ">
    <TotalResultCounter />
    </div>
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
</Modal>

