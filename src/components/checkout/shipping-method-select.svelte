<script lang="ts">
    import type {IShippingMethod} from "@models/general";
    import {moneyFormat} from "@helpers/money-format";
    import {createEventDispatcher} from "svelte";
    import {CartService} from "@services/cart.service.ts";
    import {updateCartAction} from "@stores/cart.store.ts";
    const dispatch = createEventDispatcher();

    export let shippingMethods: IShippingMethod[] = [];
    export let selectedShippingMethod: IShippingMethod = shippingMethods[0];

    async function onSelection(item: IShippingMethod) {
        let res;
        try {
            res = await new CartService().updateShippingMethod(item.uuid);
        }
        catch (e) {
            console.log(e)
        }

        updateCartAction(res);
        selectedShippingMethod = item;
        dispatch('selection', item);
    }
</script>


<div class="mt-10 border-t border-gray-200 pt-10">
    <fieldset>
        <legend class="text-lg font-medium text-gray-900">Delivery method</legend>

        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">

            {#each shippingMethods as item}
            <label on:click|preventDefault={onSelection.bind(this, item)}
                   class:border-transparent={selectedShippingMethod === item}
                   class:ring-2={selectedShippingMethod === item}
                   class:ring-indigo-500={selectedShippingMethod === item}
                    class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none">
                <input type="radio" name="delivery-method" value="Standard" class="sr-only" aria-labelledby="delivery-method-0-label" aria-describedby="delivery-method-0-description-0 delivery-method-0-description-1">
                <span class="flex flex-1">
                    <span class="flex flex-col">
                      <span id="delivery-method-0-label" class="block text-sm font-medium text-gray-900">{item.title}</span>
                      <span id="delivery-method-0-description-0" class="mt-1 flex items-center text-sm text-gray-500">{item.shippingTime} </span>
                        {#if item.baseCost}
                      <span id="delivery-method-0-description-1" class="mt-6 text-sm font-medium text-gray-900">{moneyFormat(item.baseCost)}</span>
                            {/if}
                    </span>
                  </span>

                {#if selectedShippingMethod && selectedShippingMethod.uuid === item.uuid}
                <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
                {/if}

                <span class="pointer-events-none absolute -inset-px rounded-lg border-2" aria-hidden="true"></span>
            </label>
                {/each}
        </div>
    </fieldset>
</div>
