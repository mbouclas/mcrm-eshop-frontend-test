<script lang="ts">
    import {moneyFormat} from "@helpers/money-format";
    import {cartQuantities} from "@stores/checkout.store";
    import {CartHandlers} from '@services/cart-component.service';
    import {cart} from "@stores/cart.store";
    import type {ICart} from "@stores/cart.store";
    import {httpLoading} from "@stores/http.store";

    const cartHandlers = new CartHandlers({
        items: [],
        total: 0,
    } as ICart);

    let loading = false;

    cart.subscribe((val) => {
        cartHandlers.Cart = val;
    });
    httpLoading.subscribe(val => loading = val);

</script>


    <form class="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" class="lg:col-span-7">
            <h2 id="cart-heading" class="sr-only">Items in your shopping cart</h2>

            <ul role="list" class="divide-y divide-gray-200 border-b border-t border-gray-200">
                {#each cartHandlers.Cart.items as item, idx}
                <li class="flex py-6 sm:py-10">
                    <div class="flex-shrink-0">
                        <img src={item.thumb} alt={item.title} class="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48">
                    </div>

                    <div class="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                                <div class="flex justify-between">
                                    <h3 class="text-sm">
                                        <a href={`/product/${item.sku}/${item.slug}`} class="font-medium text-gray-700 hover:text-gray-800">{item.title}</a>
                                    </h3>
                                </div>
                                <div class="mt-1 flex text-sm">
                                    <p class="text-gray-500">Sienna</p>
                                    <p class="ml-4 border-l border-gray-200 pl-4 text-gray-500">Large</p>
                                </div>
                                <p class="mt-1 text-sm font-medium text-gray-900">{moneyFormat(item.price)}</p>
                            </div>

                            <div class="mt-4 sm:mt-0 sm:pr-9">
                                <label for={`quantity-${idx}`} class="sr-only">Quantity, {item.title}</label>
                                <select id={`quantity-${idx}`} on:change={() => cartHandlers.changeQuantity(idx)} bind:value={item.quantity}
                                        name={`quantity-${idx}`} class="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                                    {#each cartQuantities as quantity}
                                    <option value={quantity}>{quantity}</option>
                                    {/each}
                                </select>

                                <div class="absolute right-0 top-0">
                                    <button on:click={cartHandlers.removeItemFromCart.bind(this, item)} type="button" class="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                                        <span class="sr-only">Remove</span>
                                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p class="mt-4 flex space-x-2 text-sm text-gray-700">
                            <svg class="h-5 w-5 flex-shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"></path>
                            </svg>
                            <span>In stock</span>
                        </p>
                    </div>
                </li>
                    {/each}

            </ul>
        </section>

        <!-- Order summary -->
        <section aria-labelledby="summary-heading" class="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 id="summary-heading" class="text-lg font-medium text-gray-900">Order summary</h2>

            <dl class="mt-6 space-y-4">
                <div class="flex items-center justify-between">
                    <dt class="text-sm text-gray-600">Subtotal</dt>
                    <dd class="text-sm font-medium text-gray-900">{moneyFormat(cartHandlers.Cart.subTotal)}</dd>
                </div>

                <div class="flex items-center justify-between border-t border-gray-200 pt-4">
                    <dt class="text-base font-medium text-gray-900">Order total</dt>
                    <dd class="text-base font-medium text-gray-900">{moneyFormat(cartHandlers.Cart.total)}</dd>
                </div>
            </dl>

            <div class="mt-6 flex text-center">
                <a href="/checkout" class="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">Checkout</a>
            </div>
        </section>
    </form>
