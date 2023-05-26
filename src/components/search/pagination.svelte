<script lang="ts">
    import {searchWithFiltersStore, setSearchAction} from "@stores/search.store";
    import {MD5} from "@helpers/general";
    import {onMount} from "svelte";
    import {SearchService} from "@services/search.service";

    export let baseURL = '',
        page = 1,
        totalPages = 0,
        currentPage = 1;

    let arrayOfPages = [],
        inDynamicMode = false,
        initialState = true,
        previousStateHash,
        filters;

    fillArrayOfPages(totalPages);
    let pages = pageNumbers(totalPages, currentPage);

    let next = (currentPage === totalPages) ? null : currentPage + 1;
    let previous = (currentPage === 1) ? null : currentPage - 1;

    onMount(() => {
        initialState = false;
    })

    searchWithFiltersStore.subscribe(state => {
        const stateHash = MD5.hash(JSON.stringify(state));
        // If !previousStateHash, we're here for the first time
        if (initialState){
            return;
        }

        if (stateHash === previousStateHash) {
            fillArrayOfPages(state.searchResults.pages);
            return;
        }

        next = (state.searchResults.page === state.searchResults.pages) ? null : state.searchResults.page + 1;
        previous = (state.searchResults.page === 1) ? null : state.searchResults.page - 1;
        fillArrayOfPages(state.searchResults.pages);
        pages = pageNumbers(state.searchResults.pages, state.searchResults.page);
        inDynamicMode = true;
        previousStateHash = stateHash;
        filters = state.appliedFilters;
    });

    function fillArrayOfPages(pages) {
        for (let i = 1; i <= pages; i++) {
            arrayOfPages.push(i)
        }
    }

    const constructUrl = (page) => {
        if (page === 1) {
            return baseURL
        }
        return baseURL + `/${page}`
    }

    function pageNumbers(count: number, current: number) {
        const shownPages = 5
        let pages = []
        if (count <= shownPages) {
            pages = arrayOfPages.slice(0, count)
        } else if (count > shownPages) {
            if (
                current < shownPages &&
                (count - 2 === shownPages || count - 1 === shownPages)
            ) {
                pages.push(...arrayOfPages)
            } else if (
                current < shownPages &&
                (count - 2 !== shownPages || count - 1 !== shownPages)
            ) {
                pages.push(...arrayOfPages.slice(0, 5), "...", count)
            } else if (current >= shownPages && current < count - shownPages) {
                pages.push(current - 1, current, current + 1, "...", count)
            } else if (current >= shownPages && current >= count - shownPages) {
                if (count - 2 === shownPages || count - 1 === shownPages) {
                    pages.push(...arrayOfPages)
                } else if (current === count) {
                    pages.push(1, "...", count - 2, count - 1, count)
                } else {
                    pages.push(1, "...", current - 1, current, current + 1)
                }
            }
        }

        return pages
    }

    async function goToPage(pageNumber: number, $e) {
        if (!inDynamicMode) {
            window.location.href = $e.target.href;
            return;
        }

        filters.page = pageNumber;
        setSearchAction(await (new SearchService().search(filters)));
    }
</script>

<nav class="flex items-center justify-between border-t border-gray-200 px-4 mx-4 my-4 sm:px-0">
    <div class="-mt-px flex w-0 flex-1">
        {#if previous}
            <a href={constructUrl(previous)} on:click|preventDefault={goToPage.bind(this, previous)}
               class="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                <svg class="mr-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                          d="M18 10a.75.75 0 01-.75.75H4.66l2.1 1.95a.75.75 0 11-1.02 1.1l-3.5-3.25a.75.75 0 010-1.1l3.5-3.25a.75.75 0 111.02 1.1l-2.1 1.95h12.59A.75.75 0 0118 10z"
                          clip-rule="evenodd"/>
                </svg>
                Previous
            </a>
        {/if}
    </div>

    <ul class="hidden md:-mt-px md:flex">
        {#each pages as page}

            <li class="page">
                {#if page !== '...'}
                    <a on:click|preventDefault={goToPage.bind(this, page)}
                            class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500"
                            class:border-indigo-500={currentPage === page}
                            class:text-indigo-600={currentPage === page}
                            class:border-transparent={currentPage !== page}
                            class:text-gray-500={currentPage !== page}
                            class:hover:text-gray-700={currentPage !== page}
                            class:hover:border-gray-300={currentPage !== page}
                            href={constructUrl(page)}
                    >
                        {page.toString()}
                    </a>
                {:else}
                    <span>{page}</span>
                {/if}
            </li>
        {/each}

    </ul>

    <div class="-mt-px flex w-0 flex-1 justify-end">
        {#if next}
            <a href={constructUrl(next)} on:click|preventDefault={goToPage.bind(this, next)}
               class="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                Next
                <svg class="ml-3 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd"
                          d="M2 10a.75.75 0 01.75-.75h12.59l-2.1-1.95a.75.75 0 111.02-1.1l3.5 3.25a.75.75 0 010 1.1l-3.5 3.25a.75.75 0 11-1.02-1.1l2.1-1.95H2.75A.75.75 0 012 10z"
                          clip-rule="evenodd"/>
                </svg>
            </a>
        {/if}
    </div>

</nav>
