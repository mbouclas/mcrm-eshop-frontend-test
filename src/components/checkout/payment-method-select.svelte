<script lang="ts">
    import type {IPaymentMethod, IShippingMethod} from "@models/general";
    import ShippingMethodSelect from "@components/checkout/shipping-method-select.svelte";
    import CC from '@components/checkout/provider-cc.svelte';
    import FormErrors from "@components/form-errors.svelte";
    import Button from "@components/buttons.component.svelte";
    export let paymentMethods: IPaymentMethod[] = [];
    export let selectedShippingMethod: IShippingMethod|null = null;
    export let selectedPaymentMethod: IPaymentMethod|null = null;
    let errors = {};

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
    }

</script>

{#if Object.keys(errors).length > 0}
    <FormErrors errors={errors} />
{/if}

<div class="mt-10 border-t border-gray-200 pt-10">
    <h2 class="text-lg font-medium text-gray-900">Payment</h2>

    <fieldset class="mt-4">
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
    </fieldset>

    {#if selectedPaymentMethod && selectedPaymentMethod.providerName === 'stripe'}
        <CC bind:paymentInformation={selectedPaymentMethod.paymentInformation} />
    {/if}
</div>


{#if selectedPaymentMethod}
    <ShippingMethodSelect shippingMethods={selectedPaymentMethod.shippingMethod} bind:selectedShippingMethod={selectedPaymentMethod.selectedShippingMethod} />
{/if}
<Button color="black" type="button" onClickHandler={validate}>Place Order</Button>
