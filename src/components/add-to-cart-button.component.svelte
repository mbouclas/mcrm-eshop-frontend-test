<script lang="ts">
import {addToCartAction} from "@stores/cart.store";

export let item: any;
export let quantity = 1;
async function handleClick() {
    await addToCartAction({
        quantity: quantity,
        id: item.id,
    });
}
</script>
<button type="button" on:click={handleClick}
        class="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Add to bag</button>
