<script lang="ts">
    import {checkoutStore} from "@stores/checkout.store";
    import type {ICartItem} from "@stores/cart.store";
    import {moneyFormat} from "@helpers/money-format";

    export let title = 'Thank you for your order!';
    let items: ICartItem[] = [],
    somebodyTookAWrongTurn = false;

    checkoutStore.subscribe((state) => {
        if (!state.latestOrder || !Array.isArray(state.latestOrder.items)) {
            somebodyTookAWrongTurn = true;
            goToHome();
            return;
        }

        items = state.latestOrder.items;
    });

    function goToHome(){
        if (typeof window === 'undefined') return;
        window.location.href = '/';
    }
</script>
<main class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8">
    <div class="max-w-full">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p class="mt-2 text-sm text-gray-500">You will soon receive a confirmation email </p>
    </div>
    <table class="mt-4 w-full text-gray-500 sm:mt-6">
        <caption class="sr-only">
            Products
        </caption>
        <thead class="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
        <tr>
            <th scope="col" class="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">Product</th>
            <th scope="col" class="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">Price</th>
            <th scope="col" class="hidden py-3 pr-8 font-normal sm:table-cell">Quantity</th>
            <th scope="col" class="hidden py-3 pr-8 font-normal sm:table-cell">Total</th>
            <th scope="col" class="w-0 py-3 text-right font-normal">Info</th>
        </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
        {#each items as item}
        <tr>
            <td class="py-6 pr-8">
                <div class="flex items-center">
                    <img src={item.thumb} alt={item.title} class="mr-6 h-16 w-16 rounded object-cover object-center">
                    <div>
                        <div class="font-medium text-gray-900">{item.title}</div>
                        <div class="mt-1 sm:hidden">{moneyFormat(item.price)}</div>
                    </div>
                </div>
            </td>
            <td class="hidden py-6 pr-8 sm:table-cell">{moneyFormat(item.price)}</td>
            <td class="hidden py-6 pr-8 sm:table-cell">{item.quantity}</td>
            <td class=" py-6 pr-8 sm:table-cell">{moneyFormat(item.price * item.quantity)}</td>
            <td class="whitespace-nowrap py-6 text-right font-medium">
                <a href={`/product/${item.sku}/${item.slug}`} class="text-indigo-600">View <span class="hidden lg:inline"> Product</span><span class="sr-only">, Men's 3D Glasses Artwork Tee</span></a>
            </td>
        </tr>
            {/each}

        </tbody>
    </table>


</main>
