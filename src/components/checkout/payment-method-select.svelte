<script lang="ts">
    import type {IPaymentMethod} from "@models/general";

    export let paymentMethods: IPaymentMethod[] = [];
</script>
<div class="mt-10 border-t border-gray-200 pt-10">
    <h2 class="text-lg font-medium text-gray-900">Payment</h2>

    <fieldset class="mt-4">
        <legend class="sr-only">Payment type</legend>
        <div class="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            {#each paymentMethods as item}
            <div class="flex items-center">
                <input id="credit-card" name="payment-type" type="radio" checked class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500">
                <label for="credit-card" class="ml-3 block text-sm font-medium text-gray-700">{item.title}</label>
            </div>
                {/each}
        </div>
    </fieldset>

    <div class="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
        <div class="col-span-4">
            <label for="card-number" class="block text-sm font-medium text-gray-700">Card number</label>
            <div class="mt-1">
                <input type="text" id="card-number" name="card-number" autocomplete="cc-number" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
        </div>

        <div class="col-span-4">
            <label for="name-on-card" class="block text-sm font-medium text-gray-700">Name on card</label>
            <div class="mt-1">
                <input type="text" id="name-on-card" name="name-on-card" autocomplete="cc-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
        </div>

        <div class="col-span-3">
            <label for="expiration-date" class="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
            <div class="mt-1">
                <input type="text" name="expiration-date" id="expiration-date" autocomplete="cc-exp" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
        </div>

        <div>
            <label for="cvc" class="block text-sm font-medium text-gray-700">CVC</label>
            <div class="mt-1">
                <input type="text" name="cvc" id="cvc" autocomplete="csc" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
        </div>
    </div>
</div>
