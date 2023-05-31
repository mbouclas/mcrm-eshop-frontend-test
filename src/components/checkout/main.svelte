<script lang="ts">
import OrderSummary from '@components/checkout/order-summary.svelte';
import Stepper from '@components/checkout/stepper.svelte';
import ShippingInformation from '@components/checkout/shipping-information.svelte';
import BillingInformation from '@components/checkout/billing-information.svelte';
import PaymentMethodSelect from '@components/checkout/payment-method-select.svelte';
import ContactInformation from '@components/checkout/contact-information.svelte';
import {
    checkoutStore,
    handleStepChangeAction, setBillingInformationAction,
    setContactInformationAction, setShippingInformationAction,
    setStepsAction
} from "@stores/checkout.store";
import {userStore} from "@stores/user.store";

let steps, config, paymentMethods, shippingMethods;

$: shippingInformation = {};
$: billingInformation = {};
$: selectedShippingMethod = null;
$: currentStep = null;

let user;
userStore.subscribe((user) => {
    // console.log('user in main', user)
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
    storeDataAfterStepChange(event.detail.stepId, event.detail.data)
    if (!nextStep) {
        return;
    }

    setStepsAction(nextStep.id, 'current');
    handleStepChangeAction(nextStep);

}

function storeDataAfterStepChange(stepId: string, payload: any) {
    if (stepId === 'contact') {
        handleContactStep(payload);
    }

    if (stepId === 'shipping') {
        handleStepShipping(payload);
    }

    if (stepId === 'billing') {
        handleStepBilling(payload);
    }

    // console.log(stepId, payload)
}

function handleContactStep(payload) {
    // Came from login
    if (payload.selectedContact) {
        shippingInformation = payload.selectedContact;
        setContactInformationAction(payload.selectedContact);
        return;
    }
    // Guest

    shippingInformation.phone = payload.contact.phone;
    if (payload.contact.firstName) {
        shippingInformation.firstName = payload.contact.firstName;
    }

    if (payload.contact.lastName) {
        shippingInformation.lastName = payload.contact.lastName;
    }

    setContactInformationAction({phone: payload.contact.phone, firstName: payload.contact?.firstName, lastName: payload.contact?.lastName});
}

function handleStepShipping(payload) {
    shippingInformation = payload;
    setShippingInformationAction(payload);
}

function handleStepBilling(payload) {
    billingInformation = payload;
    setBillingInformationAction(payload);
}

async function handleStepChange(stepChanged) {
    // setStepsAction(stepChanged.id, 'complete')
    console.log('stepChanged', stepChanged)
    console.log(steps.find(step => step.status === 'complete'))
    // handleStepChangeAction(null);
}

</script>

<div class="mb-6 lg:mb-10 bg-white p-6">

<Stepper steps={steps} />
</div>

<div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">


    <div class="bg-white p-6">

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

            <PaymentMethodSelect paymentMethods={paymentMethods} on:done={onStepDone} />
        {/if}


    </div><!-- END LEFT -->

    <div class="mt-10 lg:mt-0">
        <OrderSummary />
    </div>

</div><!-- END GRID -->
