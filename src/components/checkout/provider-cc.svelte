<script lang="ts">
    export let paymentInformation = {
        cardNumber: null,
        nameOnCard: null,
        expirationDate: null,
        cvc: null,
    }
</script>

<div class="mt-6 grid grid-cols-4 gap-x-4 gap-y-6 bg-white px-6 py-6 rounded-2xl">
    <div class="col-span-4">
        <label for="card-number" class="block text-sm font-medium text-gray-700">Card number</label>
        <div class="mt-1">
            <input bind:value={paymentInformation.cardNumber}
                    type="text" id="card-number" name="card-number" autocomplete="cc-number" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
    </div>

    <div class="col-span-4">
        <label for="name-on-card" class="block text-sm font-medium text-gray-700">Name on card</label>
        <div class="mt-1">
            <input bind:value={paymentInformation.nameOnCard}
                    type="text" id="name-on-card" name="name-on-card" autocomplete="cc-name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
    </div>

    <div class="col-span-3">
        <label for="expiration-date" class="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
        <div class="mt-1">
            <input bind:value={paymentInformation.expirationDate}
                    type="text" name="expiration-date" id="expiration-date" autocomplete="cc-exp" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
    </div>

    <div>
        <label for="cvc" class="block text-sm font-medium text-gray-700">CVC</label>
        <div class="mt-1">
            <input bind:value={paymentInformation.cvc}
                    type="text" name="cvc" id="cvc" autocomplete="csc" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
        </div>
    </div>
</div>
