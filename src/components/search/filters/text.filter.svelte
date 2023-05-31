<script lang="ts">
    import {addFilterAction, removeFilterAction} from "@stores/search.store";
    import {removeFilterValueAction} from "@stores/search.store.js";

    let query = '',
        timer;

    function onInputChanged() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            if (query.length === 0) {
                return;
            }

            removeFilterAction('page');
            addFilterAction({q: query} as any, false);
        }, 250);
    }

    function onInput(e) {
        if (e.target.value.length === 0) {
            reset();
        }
    }

    function reset() {
        removeFilterValueAction('q', query);
        removeFilterAction('page');
        query = '';
    }
</script>
<div class="relative">
    <div class="absolute top-0 bottom-0 left-0 flex items-center px-5">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    </div>
<input bind:value={query} on:keyup={onInputChanged} on:input={onInput}
       type="search"
       class="pl-16 pr-4 py-4 rounded-md shadow-md bg-white border-0 w-full outline-none"
       placeholder="Search for..."
/>
</div>
