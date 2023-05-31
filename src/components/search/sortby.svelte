<script lang="ts">
    import {removeFilterAction, setModalShownAction, setSortAction, sortOrderStore} from "@stores/search.store";
    export let type: 'main'|'modal' = "main";

    let sortOptions = [
        {
            label: 'Recommended',
            sort: 'updatedAt',
            way: 'desc'
        },
        {
            label: 'Price low to high',
            sort: 'price',
            way: 'asc'
        },
        {
            label: 'Price high to low',
            sort: 'price',
            way: 'desc'
        },
    ],
        selectedOption = sortOptions[0];

    sortOrderStore.subscribe(state => {
       selectedOption = sortOptions.find(option => option.way === state.way && option.sort === state.sort) || sortOptions[0];
    });

    function changeSort() {
        setSortAction({sort: selectedOption.sort, way: selectedOption.way})
        removeFilterAction('page');

        if (type === 'modal') {
            setModalShownAction(false);
        }
    }

</script>

    <label>Sort:</label>
<select bind:value={selectedOption} on:change={changeSort}
        id="sort" name="sort"  class=" border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
    {#each sortOptions as option}
        <option value={option}>{option.label}</option>
    {/each}
</select>


