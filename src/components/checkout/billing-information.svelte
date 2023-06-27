<script lang="ts">
    import AddressForm from '@components/user/address-form.svelte';
    // Accept a model from main. If selectedContact, autofill the form.
    import {createEventDispatcher} from "svelte";
    import {checkoutStore, setBillingInformationAction, setUseSameAsShippingAction} from "@stores/checkout.store";
    import type {ICheckoutStore} from "@stores/checkout.store";
    import type {IAddress} from "@models/user.model";
    import AddressSelector from '@components/checkout/past-address-selector.svelte';
    import {UserService} from "@services/user.service";
    import {setAlertAction} from "@stores/http.store";

    const dispatch = createEventDispatcher();
    export let model: IAddress = {} as IAddress;
    let addresses: IAddress[] = [];
    let store: ICheckoutStore,
        useSameAsShipping = false;
    checkoutStore.subscribe((state) => {
        store = state;

        useSameAsShipping = state.useBillingInformation;
        if (store.guestUser && Array.isArray(store.guestUser.addresses) && store.guestUser.addresses.length > 0) {
            addresses = store.guestUser.addresses;
        }

        if (state.contactInformation) {
            // model = state.contactInformation as IAddress;
        }

        if (state.useBillingInformation) {
            model = state.shippingInformation;
        }

    });
    async function next() {
        try {
            const res = await (new UserService()).syncAddress(model, "billing");
            model['uuid'] = res['uuid'];
        }
        catch (e) {
            setAlertAction({type: 'error', message: `Something went wrong`, position: 'top', timeout: 3000});
            return;
        }

        setBillingInformationAction(model);
        dispatch('done', {
            stepId: 'billing',
            data: model
        });
    }

    async function useSameAsShippingToggle() {
        setUseSameAsShippingAction(useSameAsShipping);
        if (useSameAsShipping) {
            return
        }

        model = store.shippingInformation;

    }

</script>
<h2 class="text-lg font-medium text-gray-900">Billing Information</h2>
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
