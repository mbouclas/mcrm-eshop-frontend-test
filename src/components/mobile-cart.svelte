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
                            <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <h3>
                                    <a href={`/product/${item.sku}/${item.slug}`}>{item.title}</a>
                                </h3>
                                <p class="ml-4">
                                    {#if !item.conditions || Array.isArray(item.conditions) && item.conditions.length === 0}
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
                            {#if item.metaData}
                                {#if item.metaData.color}
                                    <p class="mt-1 text-sm text-gray-500 dark:text-white/50">{item.metaData.color.name}</p>
                                {/if}
                            {/if}
                        </div>
                        <div class="flex flex-1 items-end justify-between text-sm">
                            <p class="text-gray-500  dark:text-white/50">Qty {item.quantity}</p>

                            <div class="flex">
                                <button on:click={cartHandlers.removeItemFromCart.bind(this, item)}
                                        type="button" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-red-800">Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </li>
            {/each}
        </ul>
    </div>

    <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
        {#if cartHandlers.Cart.appliedConditions}
            <dl class="mt-6 space-y-4">
                {#each cartHandlers.Cart.appliedConditions as condition}
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
        <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white/50">
            <p>Subtotal</p>
            <p>{moneyFormat($cart.total)}</p>
        </div>
        <p class="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div class="mt-6">
            <a href="/cart"
               class="flex items-center justify-center rounded-md border border-transparent dark:bg-blue-600 bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Get
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
