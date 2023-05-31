<script lang="ts">
    import {modalStore, setModalShownAction} from "@stores/search.store";

    export let shown = false,
    title = 'Modal';

    modalStore.subscribe(state => {
        shown = state.shown;
    })

    function close() {
        setModalShownAction(false);
    }
</script>
{#if shown}
    <div

            class="relative z-40" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-black bg-opacity-25"></div>

        <div class="fixed inset-0 z-40 flex">

            <div class="relative  flex h-full w-full  flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                <div class="flex items-center justify-between px-4 ">
                    <h2 class="text-lg font-medium text-gray-900">{title}</h2>
                    <button on:click={close}
                            type="button" class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
                        <span class="sr-only">Close menu</span>
                        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="border-t border-gray-200 px-4 py-6 mb-4 ">
<slot></slot>
                </div>
            </div>
        </div>
    </div>
{/if}
