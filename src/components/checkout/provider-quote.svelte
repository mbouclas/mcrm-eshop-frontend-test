<script lang="ts">

import Button from '@components/buttons.component.svelte';
import Modal from "@components/full-screen-modal.svelte";
import AttachFiles from "@components/checkout/quote/attach-files.svelte";
import {setModalShownAction} from "@stores/search.store";
import {cart} from "@stores/cart.store";
import type {ICart} from "@stores/cart.store";

let modalIsShown = false,
Cart: ICart;
const today = new Date();
cart.subscribe((cart) => {
    Cart = cart;
});


function toggleModal() {
    modalIsShown = !modalIsShown;
    setModalShownAction(modalIsShown);
}

</script>

<Modal title="Attach Files to Order">
<AttachFiles  on:attachFilesDone={toggleModal}/>
</Modal>
<div class="py-4">
<Button color="black" type="button" onClickHandler={toggleModal}>Attach Files</Button>
</div>

<div class="py-4">
    <div class="col-span-full">
        <label for="notes" class="block text-sm font-medium leading-6 text-gray-900">Notes</label>
        <div class="mt-2">
            <textarea bind:value={Cart.notes}
                    id="notes" name="notes" rows="3" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"></textarea>
        </div>
        <p class="mt-3 text-sm leading-6 text-gray-600">Any notes you might have concerning your order</p>
    </div>

    <div class="col-span-full mt-4">
        <label for="date" class="block text-sm font-medium leading-6 text-gray-900">Preferred delivery date</label>
        <div class="mt-2">

            <input bind:value={Cart.preferredDeliveryDate} min={`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`}
                    type="date"  name="date" id="date" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
        </div>
    </div>
</div>
