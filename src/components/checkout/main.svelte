<script lang="ts">
import OrderSummary from '@components/checkout/order-summary.svelte';
import Stepper from '@components/checkout/stepper.svelte';
import ShippingMethodSelect from '@components/checkout/shipping-method-select.svelte';
import ShippingInformation from '@components/checkout/shipping-information.svelte';
import PaymentMethodSelect from '@components/checkout/payment-method-select.svelte';
import ContactInformation from '@components/checkout/contact-information.svelte';
import {checkoutStore, handleStepChangeAction, setStepsAction} from "@stores/checkout.store";
let steps, config, paymentMethods, shippingMethods;

checkoutStore.subscribe(async (state) => {
    if (state.stepChanged) {
        await handleStepChange(state.stepChanged)
    }
    steps = state.steps;
    paymentMethods = state.paymentMethods;
    shippingMethods = state.shippingMethods;
    config = state.config;
    // console.log(steps)
});

    $: shippingInformation = {};
    $: selectedShippingMethod = null;


async function handleStepChange(stepChanged) {
    // setStepsAction('billing', 'complete')
    // console.log('stepChanged', stepChanged)
    handleStepChangeAction(null);
}
</script>
<div class="mb-6 lg:mb-10">
    {JSON.stringify(shippingInformation)}
<Stepper steps={steps} />
</div>
<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
    <div>
        <ContactInformation />

        <ShippingInformation bind:model={shippingInformation}  />

        <ShippingMethodSelect shippingMethods={shippingMethods} bind:selectedShippingMethod={selectedShippingMethod} />

        <!-- Payment -->
        <PaymentMethodSelect paymentMethods={paymentMethods} />
    </div><!-- END LEFT -->

    <div class="mt-10 lg:mt-0">
        <OrderSummary />
    </div>

</div><!-- END GRID -->
