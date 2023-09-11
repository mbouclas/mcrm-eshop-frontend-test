<script lang="ts">

import {SearchService} from "@services/search.service";
import type {Data} from "@models/products.model";
import {highlighter} from "@helpers/general";
import {optimizeCloudinaryImage} from "@helpers/cloudinary.helper";
import {appConfig, httpLoading} from "@stores/http.store";
import Spinner from '@components/loading-spiner.svelte';


let query = '';
let timer;
let results: Data[] = [];
let searchService = new SearchService();
let loading = false;

httpLoading.subscribe(state => loading = state);
async function onInputChanged() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
        if (query.length === 0) {return;}
        results = await searchService.simpleSearch(query) as Data[];

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

function onKeyPressed(e) {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const input = document.querySelector('#top-search-input') as HTMLInputElement;
        if (input) {
            input.focus();
        }

        return
    }

    if (e.key === 'Escape') {
        reset();
    }
}

function handleBackdropClick(event) {
    if (event.target.id == 'sub-backdrop' || event.target.id === 'backdrop') {
        reset()
    }
}

function submit() {
    window.location.href = `/products/all/?q=${query}`;
}

</script>

<svelte:window on:keydown={onKeyPressed}/>
<form on:submit|preventDefault={submit}>
    <div class="relative">
        <!-- INPUT -->
        <div class="relative">
            <div class="absolute top-0 bottom-0 left-0 flex items-center px-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input bind:value={query} on:keyup={onInputChanged} on:input={onInput} id="top-search-input"
                    type="search" placeholder="Search for..." class="pl-16 pr-4 py-4 rounded-md shadow-md bg-white border-0 w-full outline-none" />
        </div>


        {#if loading}
            <div class="rounded-md shadow-md bg-white absolute left-1/2 items-center -bottom-18 mt-3 p-3 z-10">
                <Spinner />
            </div>
        {/if}
        {#if results.length > 0}
            <div id="backdrop" class="fixed z-30 inset-0 bg-gray-500 bg-opacity-25 transition-opacity" on:click={handleBackdropClick}></div>
        <ul class="rounded-md shadow-md bg-white absolute left-0 right-0 -bottom-18 mt-3 p-3 z-30 max-h-[500px] overflow-y-auto">
            <li class="text-xs uppercase text-gray-400 border-b border-gray border-solid py-2 px-5 mb-2">
                Results
            </li>
            {#each results as result}
            <li on:click={goTo(result)}
                    class="grid grid-cols-10 gap-4 justify-center items-center cursor-pointer px-4 py-2 rounded-lg hover:bg-gray-50">
                <div class="flex justify-center items-center">
                    <img src={optimizeCloudinaryImage(result.thumb || appConfig.defaultNoImage, 150, 150, 'fill')} width="150" height="150" />
                </div>
                <div class="col-start-2 col-end-11 pl-8 border-l-2 border-solid border-gray">
                    <h3 class="text-gray-900 font-medium text-md">{@html highlighter(result.title, query)}</h3>
                    <p class="text-gray-600 mt-1 font-regular text-sm">

                        {@html highlighter(result.description, query)}</p>
                </div>
            </li>
            {/each}

        </ul>
            {/if}
    </div>
</form>
