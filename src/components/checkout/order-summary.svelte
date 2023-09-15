<script lang="ts">
    import {CartHandlers} from '@services/cart-component.service';
    import {moneyFormat} from "@helpers/money-format";
    import NumberPad from '@components/number-pad.svelte';
    import type {ICartItem} from "@stores/cart.store";
    import {cart} from "@stores/cart.store";
    import type {ICart} from "@stores/cart.store";
    import {httpLoading} from "@stores/http.store";
    import {setModalShownAction} from "@stores/search.store";
    import Modal from "@components/full-screen-modal.svelte";
    import AttachFiles from "@components/checkout/quote/attach-files.svelte";
    const cartHandlers = new CartHandlers({
        items: [],
        total: 0,
    } as ICart);
    let loading = false,
        modalIsShown = false,
    shipping = null;

    cart.subscribe((val) => {
        cartHandlers.Cart = val;
        getShipping();
    });
    httpLoading.subscribe(val => loading = val);


    function onQuantityChange(idx: number, qty: number) {
        cartHandlers.changeQuantity(idx, qty);
    }

    function toggleModal() {
        modalIsShown = !modalIsShown;
        setModalShownAction(modalIsShown);

    }

    function getShipping() {
        shipping = cartHandlers.Cart.appliedConditions.find(c => c.target === 'shipping');
    }

</script>
<Modal title="Attach Files to Order">
    <AttachFiles  on:attachFilesDone={toggleModal}/>
</Modal>
<h2 class="text-lg font-medium text-gray-900">Order summary</h2>

<div class="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
    <h3 class="sr-only">Items in your cart</h3>
    <ul role="list" class="divide-y divide-gray-200">
        {#each cartHandlers.Cart.items as item, idx}
        <li class="flex px-4 py-6 sm:px-6">
            <div class="flex-shrink-0">
                <img src={item.thumb} alt={item.title} class="w-20 rounded-md">
            </div>

            <div class="ml-6 flex flex-1 flex-col">
                <div class="flex">
                    <div class="min-w-0 flex-1">
                        <h4 class="text-sm">
                            <a href={`/product/${item.sku}/${item.slug}`} class="font-medium text-gray-700 hover:text-gray-800">{item.title}</a>
                        </h4>
                        {#if item.metaData}
                            {#if item.metaData.color}
                                <p class="mt-1 text-sm text-gray-500">{item.metaData.color.name}</p>
                            {/if}
                            {#if Array.isArray(item.metaData.uploadedFiles) && item.metaData.uploadedFiles.length > 0}
                                <div class="grid grid-cols-2">
                                    <p class=" text-sm text-gray-500">{item.metaData.uploadedFiles.length} Files Attached</p>

                                    <p class="text-right">
                                        <button type="button" on:click={toggleModal} title="Edit">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 hover:text-gray-700"
                                                 width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/></svg>
                                        </button>
                                    </p>
                                </div>
                            {:else}
                                <button type="button" on:click={toggleModal} title="Attach Logo"
                                        class="mt-4 inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Attach Logo
                                    <svg class="h-5 w-5 text-white"
                                         xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M15 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7l-5-5zM6 20V4h8v4h4v12H6zm10-10v5c0 2.21-1.79 4-4 4s-4-1.79-4-4V8.5a2.5 2.5 0 0 1 2.76-2.49c1.3.13 2.24 1.32 2.24 2.63V15h-2V8.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V15c0 1.1.9 2 2 2s2-.9 2-2v-5h2z"/></svg>
                                </button>
                            {/if}
                        {/if}

                    </div>

                    <div class="ml-4 flow-root flex-shrink-0">
                        <button on:click={cartHandlers.removeItemFromCart.bind(this, item)}
                                type="button" class="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Remove</span>
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ml-4 items-center justify-center">
                    <label for={`quantity-${idx}`} class="sr-only">Quantity</label>
                    <NumberPad min={1} max={10000} counter={item.quantity} on:numberPadChange={(e) => onQuantityChange(idx, e.detail)} />

                </div>

                <div class="flex flex-1 items-end justify-between pt-2 bg-gray-100 p-2">
                    <p class="mt-1 text-sm  text-gray-900">
                        {#if !item.conditions}
                            {moneyFormat(item.price)}
                        {:else}
                                        <span class="line-through text-gray-400">
                                            {moneyFormat(item.price)}
                                        </span>
                            {moneyFormat(item.price - item.conditions.reduce((acc, condition) => acc + condition.parsedRawValue, 0))}
                            <span class="text-sm text-gray-400">
                                            {#each item.conditions as cond}
                                                <br>
                                                {cond.title}:
                                                {#if cond.parsedRawValueType.operator === 'add'}
                                                    + {moneyFormat(cond.parsedRawValue)}
                                                {:else}
                                                    - {moneyFormat(cond.parsedRawValue)}
                                                {/if}
                                                    {/each}
                                        </span>
                        {/if}
                    </p>


                </div>

            </div>
        </li>
        {/each}

    </ul>

    <dl class="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex items-center justify-between">
            {#if cartHandlers.Cart.appliedConditions}
                <dl class="mt-6 space-y-4">
                    {#each cartHandlers.Cart.appliedConditions.filter(c => c.target !== 'shipping') as condition}
                        <div class="flex items-center justify-between">
                            <dt class="text-sm text-gray-600">{condition.title}</dt>
                            <dd class="text-sm font-medium text-gray-900">
                                {#if condition.parsedRawValueType.operator === 'add'}
                                    +
                                {:else}
                                    -
                                {/if}
                                {moneyFormat(condition.parsedRawValue)}
                            </dd>
                        </div>
                    {/each}
                </dl>
            {/if}

        </div>
        {#if shipping}
            <dl class="mt-6 space-y-4">
                <div class="flex items-center justify-between">
                    <dt class="text-sm text-gray-600">{shipping.title}</dt>
                    <dd class="text-sm font-medium text-gray-900">
                        {moneyFormat(shipping.parsedRawValue)}
                    </dd>
                </div>
            </dl>
        {/if}
        <div class="flex items-center justify-between">
            <dt class="text-sm">Subtotal</dt>
            <dd class="text-sm font-medium text-gray-900">{moneyFormat(cartHandlers.Cart.subTotal)}</dd>
        </div>
        <div class="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt class="text-base font-medium">Total</dt>
            <dd class="text-base font-medium text-gray-900">{moneyFormat(cartHandlers.Cart.total)}</dd>
        </div>
    </dl>


</div>
