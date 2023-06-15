<script lang="ts">
    import {fly, fade} from 'svelte/transition';
    import MediaQuery from '@components/media-query.svelte';
    import {modalStore, setModalShownAction} from "@stores/search.store";
    import type {Data} from "@models/products.model";
    import {SearchService} from "@services/search.service";
    import {appConfig, httpLoading} from "@stores/http.store";
    import Spinner from "@components/loading-spiner.svelte";
    import {optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
    import {highlighter} from "@helpers/general";
    const modalId = 'mobileSearch';
    let isShown = false;
    let query = '';
    let timer;
    let results: Data[] = [];
    let searchService = new SearchService();
    let loading = false;
    let selectedResult;
    httpLoading.subscribe(state => loading = state);
    $: nothingFound = query.length > 2 && results.length === 0;

    modalStore.subscribe(state => {
        if (state.id !== modalId) {
            return;
        }

        isShown = state.shown;
    });

    async function onInputChanged() {
        clearTimeout(timer);
        loading = true
        timer = setTimeout(async () => {
            if (query.length === 0) {
                loading = false;
                return;
            }

            results = await searchService.simpleSearch(query) as Data[];
            loading = false;
        }, 250);

    }

    function goTo(item: Data) {
        window.location.href = `/product/${item.sku}/${item.slug}`;
    }

    function reset() {
        query = '';
        results = [];
    }

    function onInput(e) {
        if (e.target.value.length === 0) {
            reset();
        }
    }

function handleBackdropClick(event) {
    if (event.target.id == 'sub-backdrop' || event.target.id === 'backdrop') {
        return setModalShownAction(false, modalId);
    }
}

function selectResult(result) {
        selectedResult = result;
}
</script>
{#if isShown}
<div class="relative z-30" role="dialog" aria-modal="true" on:click={handleBackdropClick}>

    <div id="backdrop" class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity"></div>

    <div id="sub-backdrop" class="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">

        <div in:fly="{{ duration: 500 }}" out:fade="{{duration: 100}}"
                class="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
            <div class="relative">
                <svg class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                </svg>
                <input bind:value={query} on:keyup={onInputChanged} on:input={onInput}
                        type="search" class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." role="combobox" aria-expanded="false" aria-controls="options">
            </div>
            {#if results && results.length > 0}

            <div class="flex divide-x divide-gray-100">
                <div class="max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4 sm:h-96">
                    <h2 class="mb-4 mt-2 text-xs font-semibold text-gray-500">Search Results</h2>

                    <!-- Results, show/hide based on command palette state. -->
                    <ul class="-mx-2 text-sm text-gray-700" id="options" role="listbox">

                        {#each results as result}
                            <MediaQuery query="(min-width: 481px) and (max-width: 1280px)" let:matches>
                                {#if matches}
                        <li class:bg-gray-100={selectedResult === result} on:click={selectResult.bind(this, result)}
                                class=" group flex cursor-default select-none items-center rounded-md p-2" id="option-1" role="option" tabindex="-1">
                            <img src={optimizeCloudinaryImage(result.thumb || appConfig.defaultNoImage, 150, 150, 'fill')} class="h-12 w-12 flex-none rounded-full">

                            <span class="ml-3 flex-auto truncate">{result.title}</span>

                            {#if selectedResult === result}
                            <svg class="ml-3  h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                            </svg>
                                {/if}
                        </li>
                                    {/if}
                                    </MediaQuery>
                            <MediaQuery query="(max-width: 480px)" let:matches>
                                {#if matches}
                            <li class="block sm:hidden group flex cursor-default select-none items-center rounded-md p-2" on:click={goTo.bind(this, result)}>
                                <img src={optimizeCloudinaryImage(result.thumb || appConfig.defaultNoImage, 150, 150, 'fill')} alt=""
                                     class="h-12 w-12 flex-none rounded-full">
                                <span class="ml-3 flex-auto truncate">{result.title}</span>
                            </li>
                                    {/if}
                                    </MediaQuery>
                            {/each}
                    </ul>
                </div>
                {#if selectedResult}
                <div class="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                    <div class="flex-none p-6 text-center">
                        <img src={optimizeCloudinaryImage(selectedResult.thumb || appConfig.defaultNoImage, 150, 150, 'fill')}
                             alt="" class="mx-auto h-32 w-32 rounded-full">
                        <h2 class="mt-3 font-semibold text-gray-900">{selectedResult.title}</h2>
                        <div class="text-sm leading-6 text-gray-500">{@html highlighter(selectedResult.title, query)}</div>
                        <p class="text-gray-600 mt-1 font-regular text-sm">

                            {@html highlighter(selectedResult.description, query)}</p>
                    </div>
                    <div class="my-3">
                    <button type="button" on:click={goTo.bind(this, selectedResult)}
                            class="mt-6 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Go to product</button>
                    </div>
                </div>
                    {/if}
            </div>
                {/if}
            {#if loading}
                <div class="rounded-md shadow-md bg-white absolute left-1/2 items-center -bottom-18 mt-3 p-3 z-10">
                    <Spinner />
                </div>
            {/if}
            {#if query.length === 0 && (results && results.length === 0)}
                <div class="border-t border-gray px-6 py-14 text-center text-sm sm:px-14">
                    <svg class="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
                    </svg>
                    <p class="mt-4 font-semibold text-gray-900">Search for products</p>
                    <p class="mt-2 text-gray-500">Quickly find what you're looking for in our store.</p>
                </div>
                {/if}


            {#if nothingFound}
                    <div class="px-6 py-14 text-center text-sm sm:px-14">
                        <svg class="mx-auto h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                        <p class="mt-4 font-semibold text-gray-900">Nothing found</p>
                        <p class="mt-2 text-gray-500">We couldn’t find anything with that term. Please try again.</p>
                    </div>
                {/if}
        </div>
    </div>
</div>

{/if}
