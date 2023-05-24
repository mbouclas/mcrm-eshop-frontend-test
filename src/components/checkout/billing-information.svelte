<script lang="ts">
    import AddressForm from '@components/user/address-form.svelte';
    // Accept a model from main. If selectedContact, autofill the form.
    import {createEventDispatcher} from "svelte";
    import {checkoutStore} from "@stores/checkout.store";
    import type {ICheckoutStore} from "@stores/checkout.store";
    import type {IAddress} from "@models/user.model";
    import AddressSelector from '@components/checkout/past-address-selector.svelte';

    const dispatch = createEventDispatcher();
    export let model = {};
    let addresses: IAddress[] = [];
    let store: ICheckoutStore;
    $: useSameAsShipping = false;
    checkoutStore.subscribe((state) => {
        store = state;
        if (store.guestUser && Array.isArray(store.guestUser.addresses) && store.guestUser.addresses.length > 0) {
            addresses = store.guestUser.addresses;
        }

        if (state.contactInformation) {
            model = state.contactInformation;
        }
    });
    function next() {
        dispatch('done', {
            stepId: 'billing',
            data: model
        });
    }

    function useSameAsShippingToggle() {
        if (useSameAsShipping) {
            model = store.shippingInformation;
            console.log(store)
        }
    }

</script>
{#if addresses.length > 0}

    <AddressSelector model={model} addresses={addresses} on:setAddress={(e) => {model = e.detail}} />
{/if}


<div class="relative flex gap-x-3">
    <div class="flex h-6 items-center">
        <input bind:checked={useSameAsShipping} on:change={useSameAsShippingToggle}
                id="comments" name="comments" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
    </div>
    <div class="text-sm leading-6">
        <label for="comments" class="font-medium text-gray-900">Use same as shipping</label>
        <p class="text-gray-500">Use the same address you entered in shipping information</p>
    </div>
</div>
<AddressForm formTitle="Billing Information" model={model} on:formValid={next} />
