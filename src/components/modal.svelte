<script lang="ts">
    import {modalStore, setModalShownAction} from "@stores/search.store.ts";

    export let show = false;
    export let closeOnBackdropClick = true;
    export let onClose: () => void;
    const sizes = {
        'full': 'w-full inset-0 h-full',
        'half': 'w-full sm:w-1/2 md:2/3 md:inset-x-1/4 inset-0 top-10 h-4/5',
    }

    export let shown = false,
        title = 'Modal',
        id = 'default',
        size = 'full';

    let sizeClass = sizes[size];

    modalStore.subscribe(state => {
        if (state.id !== id) {return;}
        shown = state.shown;
        sizeClass = sizes[state[id] ? state[id].type : size];
        closeOnBackdropClick = state[id] ? state[id].closeOnBackdropClick : closeOnBackdropClick;

        if (typeof document !== 'undefined') {
            if (shown) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        }
    });

    function close() {
        setModalShownAction(false, id);
        if (onClose) {
            onClose();
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!closeOnBackdropClick) {
            return;
        }

        if (event.key === 'Escape') {
            close();
        }
    }

    function onBackDropClick(e: MouseEvent) {
        if (!closeOnBackdropClick) {
            return;
        }

        if (e.target.id === 'modal-backdrop') {
            close();
        }

    }
</script>
<svelte:window on:keydown={handleKeydown}/>

{#if shown}
    <div class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true" on:click={onBackDropClick}>

        <div  class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity " ></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div id="modal-backdrop"
                 class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                <div id="modal-content" class:modal-open={shown}
                     class:modal-closed={!shown}
                     class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 max-w-full w-full sm:w-full sm:max-w-3xl sm:p-6">
                    <div class="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                        <button on:click={close}
                                type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span class="sr-only">Close</span>
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div class="sm:flex sm:items-start w-full">

                        <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                            {#if title && !$$slots.title}
                                <h2 class="text-base font-semibold leading-6 text-gray-900">{title}</h2>
                            {/if}
                            {#if $$slots.title}
                                <slot name="title"></slot>
                            {/if}

                            <div class="mt-2">
                                <slot></slot>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
{/if}
