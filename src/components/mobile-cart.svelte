<script lang="ts">
    import {cart} from "@stores/cart.store";
    import type {ICart} from "@stores/cart.store";
    import {moneyFormat} from "@helpers/money-format";
    import {setModalShownAction} from "@stores/search.store";
    import {CartHandlers} from "@services/cart-component.service";

    const cartHandlers = new CartHandlers({
        items: [],
        total: 0,
    } as ICart);

    cart.subscribe((state) => {
        cartHandlers.Cart = state;

    });

    function close() {
        setModalShownAction(false, 'mobileCart');
    }
</script>

<div class="mt-8">
    <div class="flow-root">
        <ul role="list" class="-my-6 divide-y divide-gray-200">
            {#each $cart.items as item}
                <li class="flex py-6">
                    <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img src={item.thumb} class="h-full w-full object-cover object-center">
                    </div>

                    <div class="ml-4 flex flex-1 flex-col">
                        <div>
                            <div class="flex justify-between text-base font-medium text-gray-900">
                                <h3>
                                    <a href={`/product/${item.sku}/${item.slug}`}>{item.title}</a>
                                </h3>
                                <p class="ml-4">{moneyFormat(item.price)}</p>
                            </div>
                            {#if item.metaData}
                                {#if item.metaData.color}
                                    <p class="mt-1 text-sm text-gray-500">{item.metaData.color.name}</p>
                                {/if}
                            {/if}
                        </div>
                        <div class="flex flex-1 items-end justify-between text-sm">
                            <p class="text-gray-500">Qty {item.quantity}</p>

                            <div class="flex">
                                <button on:click={cartHandlers.removeItemFromCart.bind(this, item)}
                                        type="button" class="font-medium text-indigo-600 hover:text-indigo-500">Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>

    <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        <div class="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{moneyFormat($cart.total)}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div class="mt-6">
            <a href="#"
               class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Get
                Quote</a>
        </div>
        <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
            <p>
                or
                <button type="button" on:click={close}
                        class="font-medium text-indigo-600 hover:text-indigo-500">
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                </button>
            </p>
        </div>
    </div>
</div>
