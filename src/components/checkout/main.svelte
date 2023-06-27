<script lang="ts">
import OrderSummary from '@components/checkout/order-summary.svelte';
import Stepper from '@components/checkout/stepper.svelte';
import ShippingInformation from '@components/checkout/shipping-information.svelte';
import BillingInformation from '@components/checkout/billing-information.svelte';
import PaymentMethodSelect from '@components/checkout/payment-method-select.svelte';
import ContactInformation from '@components/checkout/contact-information.svelte';
import EmptyCartMessage from '@components/checkout/cart-is-empty.svelte';
import {
    checkoutStore,
    handleStepChangeAction, setCheckoutDoneAction,
    setStepsAction
} from "@stores/checkout.store";
import {userStore} from "@stores/user.store";
import {CheckoutService} from "@services/checkout.service";
import {cart} from "@stores/cart.store";
import type {ICartItem} from "@stores/cart.store";
import {setAlertAction} from "@stores/http.store";



let steps, config, paymentMethods, shippingMethods;

$: shippingInformation = {};
$: billingInformation = {};
$: selectedShippingMethod = null;
$: currentStep = null;

let user, cartItems: ICartItem[] = [];

cart.subscribe((cart) => {

    if (!cart || !cart.items || cart.items.length === 0) {
        return;
    }

    cartItems = cart.items;
});

checkoutStore.subscribe(async (state) => {
    if (state.stepChanged) {
        await handleStepChange(state.stepChanged)
    }
    steps = state.steps;
    paymentMethods = state.paymentMethods;
    shippingMethods = state.shippingMethods;
    config = state.config;
    currentStep = steps.find(step => step.current)
});


const onStepDone = (event) => {
    setStepsAction(event.detail.stepId, 'complete');
    const currentIdx = steps.findIndex(step => step.id === event.detail.stepId);
    const nextStep = steps[currentIdx + 1];
    // storeDataAfterStepChange(event.detail.stepId, event.detail.data)
    if (!nextStep) {
        return;
    }

    setStepsAction(nextStep.id, 'current');
    handleStepChangeAction(nextStep);

}



async function handleStepChange(stepChanged) {
    // setStepsAction(stepChanged.id, 'complete')
    // console.log('stepChanged', stepChanged)
    // console.log(steps.find(step => step.status === 'complete'))
    // handleStepChangeAction(null);
}

async function checkoutDone() {
    const order = checkoutStore.get();
    const validator = CheckoutService.orderIsValid(order);

    if (!validator.isValid) {
        console.log('order is not valid', validator.errors)
        return;

    }

    const res = await (new CheckoutService()).done(order);
    if (!res.success) {
        setAlertAction({type: 'error', message: `Something went wrong, contact the store`, position: 'top', timeout: 3000});
        return;
    }
    await setCheckoutDoneAction(res);
    window.location.href ='/thank-you';
}

</script>
{#if cartItems.length === 0}
    <EmptyCartMessage />
{:else}
<div class="mb-6 lg:mb-10 bg-white p-6">

<Stepper steps={steps} />
</div>

<div class="lg:grid md:grid-cols-12 lg:gap-x-12 xl:gap-x-16">


    <div class="bg-white p-6 md:col-span-6 lg:col-span-7">

        {#if currentStep && currentStep.id === 'contact'}
            <ContactInformation on:done={onStepDone} />
        {/if}

        {#if currentStep && currentStep.id === 'shipping'}

        <ShippingInformation bind:model={shippingInformation} on:done={onStepDone}  />
        {/if}

        {#if currentStep && currentStep.id === 'billing'}

            <BillingInformation bind:model={billingInformation} on:done={onStepDone} />
        {/if}


        {#if currentStep && currentStep.id === 'payment'}

            <PaymentMethodSelect paymentMethods={paymentMethods} on:done={onStepDone} on:checkoutDone={checkoutDone} />
        {/if}


    </div><!-- END LEFT -->

    <div class="mt-10 lg:mt-0 md:col-span-6 lg:col-span-5">
        <OrderSummary />
    </div>

</div><!-- END GRID -->
    {/if}
