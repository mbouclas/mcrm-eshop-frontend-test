<script lang="ts">
    import {searchWithFiltersStore} from "@stores/search.store";

    export let count = 0,
        suffix = 'Products';

    searchWithFiltersStore.subscribe(state => {
        count = state.searchResults.total;
    })
</script>
{count} {suffix}
