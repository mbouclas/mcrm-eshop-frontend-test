<script lang="ts">
    import AddressForm from '@components/user/address-form.svelte';
    // Accept a model from main. If selectedContact, autofill the form.
    import {createEventDispatcher} from "svelte";
    import {checkoutStore, setShippingInformationAction} from "@stores/checkout.store";
    import type {ICheckoutStore} from "@stores/checkout.store";
    import type {IAddress} from "@models/user.model";
    import AddressSelector from '@components/checkout/past-address-selector.svelte';
    import {UserService} from "@services/user.service";


    const dispatch = createEventDispatcher();
    let store: ICheckoutStore;
    let addresses: IAddress[] = [];
    export let model: IAddress = {} as IAddress;

    checkoutStore.subscribe((state) => {
        store = state;
       if (store.guestUser && Array.isArray(store.guestUser.addresses) && store.guestUser.addresses.length > 0) {
           addresses = store.guestUser.addresses;
       }

       if (state.contactInformation) {
           model = state.contactInformation as IAddress;
       }
    });




    async function next() {
        try {
            const res = await (new UserService()).syncAddress(model, "shipping");
            model['uuid'] = res['uuid'];
        }
        catch (e) {
            console.log(e);
        }


        setShippingInformationAction(model);
        dispatch('done', {
            stepId: 'shipping',
            data: model
        });
    }


</script>
{#if addresses.length > 0}

<AddressSelector model={model} addresses={addresses} on:setAddress={(e) => {model = e.detail}} />
{/if}

<AddressForm formTitle="Shipping Information" model={model} on:formValid={next} />
