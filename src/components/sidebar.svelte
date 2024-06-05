<script lang="ts">
    import {fly} from "svelte/transition";
    import {modalStore, setModalShownAction} from "@stores/search.store";

    export let shown = false,
        title = 'Sidebar',
        id = 'default';

    modalStore.subscribe(state => {
        if (typeof state.items[id] === 'undefined') {
            shown = false;
            return;
        }

        if (typeof document === 'undefined') {
            return;
        }

        shown = state.items[id];

        if (shown) {

            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }

    })

    function close() {
        setModalShownAction(false, id);
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            close();
        }
    }


    function handleBackdropClick(event) {
        if (event.target.id == 'sub-backdrop' || event.target.id === 'backdrop') {
            close()
        }
    }
</script>
<svelte:window on:keydown={handleKeydown}/>
{#if shown}
    <div id="backdrop" class="fixed z-50 inset-0 bg-gray-500 bg-opacity-25 transition-opacity" on:click={handleBackdropClick}></div>

    <div id="drawer-navigation" in:fly={{ x: '-100%', duration: 200 }} out:fly={{ x: '-100%', duration: 200 }}
     class="fixed top-0 left-0 z-50 h-screen p-4 overscroll-contain overflow-y-auto transition-transform bg-white w-80 dark:bg-gray-800 transform-none" tabindex="-1" aria-labelledby="drawer-navigation-label">

    {#if title && !$$slots.title}
        <h5 id="drawer-navigation-label" class="text-base font-semibold text-gray-500 dark:text-gray-400">{title}</h5>
    {/if}
    {#if $$slots.title}
        <slot name="title"></slot>
    {/if}
    <button type="button" on:click={close} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" >
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Close menu</span>
    </button>
    <div class="py-4 overflow-y-auto dark:text-white">
        <slot></slot>
    </div>
        <div class="h-12"></div>
</div>
    {/if}
