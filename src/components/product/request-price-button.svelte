<script lang="ts">
    import Modal from "@components/modal.svelte";
    import RequestPriceForm from "@components/product/request-price-form.svelte";
    import {setModalShownAction} from "@stores/search.store.ts";
    export let id;

    function onClick() {
        setModalShownAction(true, 'requestPriceModal');
    }

    function close() {
        setModalShownAction(false, 'requestPriceModal');
    }

    function onSubmit() {
        setTimeout(() => {
            close();
        }, 2000)
    }
</script>
<Modal  id="requestPriceModal" title="Request Price" onClose={() => {}}>
<RequestPriceForm {id} onSubmit={onSubmit} />
</Modal>

<button title="Request Price" on:click={onClick} type="button"
        class="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
    Request Price
</button>
