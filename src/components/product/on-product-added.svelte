<script lang="ts">
    import {cart, cartEventsStore} from "@stores/cart.store.ts";
import Modal from "@components/modal.svelte";
    import {setModalShownAction, setModalToggleAction} from "@stores/search.store.ts";
import {moneyFormat} from "@helpers/money-format.ts";
    import Button from "@components/buttons.component.svelte";
let item,
modalIsShown = true;
cartEventsStore.subscribe((state) => {

    if (!state || state.action !== 'add') {
        return;
    }

    if (!state.product || !state.product.metaData) {
        return;
    }

    setModalShownAction(true, 'productAddedModal');
    item = {
        title: state.product.metaData.title,
        quantity: state.product.metaData.cartItem.quantity,
        image: state.product.metaData.cartItem.thumb,
        price: state.product.metaData.cartItem.price
    }

});

function close() {
    setModalShownAction(false, 'productAddedModal');
}

function viewCart() {
    // window.location.href = '/cart';
    close();
    setModalToggleAction('mobileCart');
}

</script>
{#if item}
<Modal  id="productAddedModal" title="Product Added" onClose={() => {}}>
    <div class="grid grid-cols-12 gap-1.5">
        <div class="col-span-12 sm:col-span-6">
            <div class="flex justify-between ">
                <img src={item.image} class="w-32" />
                <span></span>
                <div class="ml-4">
                    <h3 class="text-lg font-semibold text-heading">{item.title} x {item.quantity}</h3>
                    <p class="text-sm text-gray-600">{moneyFormat(item.price)}</p>
                </div>
            </div>

        </div>
        <div class="col-span-12 sm:col-span-6">
            <div class="flex-col flex gap-y-2 w-full px-4">
                <h4 class="heading-3 text-base text-center">{$cart.numberOfItems} Items in cart
                    ({moneyFormat($cart.subTotal)})
                </h4>
                <Button color="primary" type="button" onClickHandler={viewCart}>View Cart</Button>
                <Button color="secondary" type="button" onClickHandler={close}>Continue Shopping</Button>
            </div>

        </div>
    </div>
</Modal>
{/if}
