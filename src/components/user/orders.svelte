<script lang="ts">
    import {onMount, onDestroy} from "svelte";
    import {UserService} from "@services/user.service";
    import type {IOrderFromHistory, IOrderQueryResponse, IOrderStatus} from "@models/order.model";
    import {checkoutStore} from "@stores/checkout.store";
    import Sidebar from "@components/sidebar.svelte";
    import {setModalToggleAction} from "@stores/search.store";
    import {moneyFormat} from "@helpers/money-format";

    let orders: IOrderQueryResponse,
    statuses: IOrderStatus[] = [],
    selectedOrder: IOrderFromHistory;

    onMount(async () => {
        orders = await (new UserService()).getOrders();
        statuses = checkoutStore.get().config.orderStatuses;

    });

    onDestroy(() => {
        // console.log('destroyed');
    });

    function getStatus(id: number) {
        return statuses.find(s => s.id === id);
    }

    function toggleSidebar(order) {
        selectedOrder = order;
        setModalToggleAction('OrderSideBar');
    }
</script>
<div>
    <div class="max-w-xl">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Your Requested Quotes</h1>
        <p class="mt-2 text-sm text-gray-500">A history of all the quotes you have requested.</p>
    </div>

    {#if orders && orders.data}
        <Sidebar title="Cart" id="OrderSideBar">
            {#if selectedOrder}
            <h2 class="text-lg font-medium text-gray-900 md:flex-shrink-0">Order #{selectedOrder.orderId}</h2>
                <p style={`color: ${getStatus(selectedOrder.status).color}`}>Status: {getStatus(selectedOrder.status).label}</p>
                <ul role="list" class="divide-y divide-gray-200">
                {#each selectedOrder.metaData.cart.items as item}
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
                                    <p class="ml-4">{moneyFormat(item.price)}</p>
                                </div>
                                {#if item.metaData}
                                    {#if item.metaData.color}
                                        <p class="mt-1 text-sm text-gray-500 dark:text-white/50">{item.metaData.color.name}</p>
                                    {/if}
                                {/if}
                            </div>
                            <div class="flex flex-1 items-end justify-between text-sm">
                                <p class="text-gray-500  dark:text-white/50">Qty {item.quantity}</p>
                            </div>
                        </div>
                    </li>
                {/each}
                </ul>

                <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white/50">
                        <p>Subtotal</p>
                        <p>{moneyFormat(selectedOrder.total)}</p>
                    </div>

                </div>
            {/if}
        </Sidebar>
    {#each orders.data as order}

        <div class="mt-12 space-y-16 sm:mt-16">
            <section aria-labelledby="4376-heading">
                <div class="space-y-1 md:flex md:items-baseline md:space-x-4 md:space-y-0">
                    <h2 class="text-lg font-medium text-gray-900 md:flex-shrink-0">#{order.orderId}</h2>
                    <div class="space-y-5 sm:flex sm:items-baseline sm:justify-between sm:space-y-0 md:min-w-0 md:flex-1">
                        <p style={`color: ${getStatus(order.status).color}`}
                                class="text-sm font-medium text-gray-500">{getStatus(order.status).label}</p>

                        <div class="flex text-sm font-medium">

                            <div class="ml-4 border-l border-gray-200 pl-4 sm:ml-6 sm:pl-6">
                                <a href="#" on:click|preventDefault={toggleSidebar.bind(this, order)}
                                   class="text-indigo-600 hover:text-indigo-500">View Order</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="-mb-6 mt-6 flow-root divide-y divide-gray-200 border-t border-gray-200">
                </div>

            </section>
        </div>



    {/each}
        {:else}
        <p>No quotes yet. Go ahead and create one by adding some products to your cart.</p>
        {/if}
</div>
