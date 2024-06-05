<script lang="ts">
import {addToCartAction} from "@stores/cart.store";
import {isBagValid, productStore} from "@stores/product.store";


export let item: any;
export let quantity = 1;
let valid = false,
    selection;
isBagValid.subscribe(state => {
    valid = state;
    if (!valid) {return;}

    selection = productStore.get();

});
async function handleClick() {
    const selection = productStore.get();
    const metaData = {
        title: item.title,
    };
    Object.keys(selection).filter(key => key !== 'quantity')
        .forEach(key => metaData[key] = selection[key]);

    await addToCartAction({
        quantity: selection.quantity,
        id: item.id,
        variantId: selection.color && selection.color.variant && selection.color.variant.uuid,
        metaData
    });


}
</script>
<button type="button" on:click={handleClick} disabled={!valid}
        class:disabled:opacity-50={!valid}
        class:cursor-not-allowed={!valid}
        title={!valid ? `Not ready` : ''}
        class="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
    <slot>Add to order</slot>
</button>
