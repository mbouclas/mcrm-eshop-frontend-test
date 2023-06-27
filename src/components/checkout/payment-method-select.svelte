<script lang="ts">
    import type {IEvent, IPaymentMethod, IShippingMethod} from "@models/general";
    import ShippingMethodSelect from "@components/checkout/shipping-method-select.svelte";
    import CC from '@components/checkout/provider-cc.svelte';
    import Quote from '@components/checkout/provider-quote.svelte';
    import FormErrors from "@components/form-errors.svelte";
    import Button from "@components/buttons.component.svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import {setPaymentMethodAction} from "@stores/checkout.store";
    export let paymentMethods: IPaymentMethod[] = [];
    export let selectedShippingMethod: IShippingMethod|null = null;
    export let selectedPaymentMethod: IPaymentMethod|null = null;
    let errors = {};
    const dispatch = createEventDispatcher();

    onMount(() => {
        selectedPaymentMethod = paymentMethods[0];
        setPaymentMethodAction(selectedPaymentMethod);
    });

    function setPaymentMethod(item) {
        selectedPaymentMethod = item;

        if (!selectedShippingMethod) {return;}
        if (selectedPaymentMethod?.shippingMethod.findIndex((x) => x.uuid === selectedShippingMethod?.uuid) === -1) {
            selectedShippingMethod = null;
        }

    }

    async function validate() {
        errors = {};
        if (!selectedPaymentMethod) {
            errors['paymentMethod'] = 'Please select a payment method';
            return;
        }

        if (!selectedPaymentMethod.selectedShippingMethod) {
            errors['shippingMethod'] = 'Please select a shipping method';
            return;
        }

        dispatch('checkoutDone');
    }

    function setShippingMethod(e: IEvent<IShippingMethod>) {
        selectedPaymentMethod.selectedShippingMethod = e.detail;
        setPaymentMethodAction(selectedPaymentMethod);
    }

</script>

{#if Object.keys(errors).length > 0}
    <FormErrors errors={errors} />
{/if}

<div class=" border-t border-gray-200 pt-10">
    <h2 class="text-lg font-medium text-gray-900">Finalize your quotation</h2>

<!--    <fieldset class="mt-4">
        <legend class="sr-only">Payment type</legend>
        <div class="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            {#each paymentMethods as item}
            <div class="flex items-center">
                <label for={item.slug} class="ml-3 block text-sm font-medium text-gray-700">
                <input on:click={() => setPaymentMethod(item)}
                        id={item.slug} name="payment-type" type="radio" class="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500">
                {item.title}</label>
            </div>
                {/each}
        </div>
    </fieldset>-->

    {#if selectedPaymentMethod && selectedPaymentMethod.providerName === 'stripe'}
        <CC bind:paymentInformation={selectedPaymentMethod.paymentInformation} />
    {/if}

    {#if selectedPaymentMethod && selectedPaymentMethod.providerName === 'quote'}
        <Quote bind:paymentInformation={selectedPaymentMethod.paymentInformation} />
    {/if}
</div>


{#if selectedPaymentMethod && selectedPaymentMethod.shippingMethod.length > 0}
    <ShippingMethodSelect on:selection={setShippingMethod}
            shippingMethods={selectedPaymentMethod.shippingMethod} bind:selectedShippingMethod={selectedPaymentMethod.selectedShippingMethod} />
{/if}


<Button color="cta" type="button" onClickHandler={validate}>Finish</Button>
