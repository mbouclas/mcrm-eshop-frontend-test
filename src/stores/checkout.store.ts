import {atom, action, task, onMount} from 'nanostores';
import {setHttpLoading} from "@stores/http.store";
import type {IStep} from "@models/checkout";
import {CheckoutService} from "@services/checkout.service";
import type {IPaymentMethod, IShippingMethod, IStoreConfig} from "@models/general";
export const cartQuantities = [1,2,3,4,5,6,7,8,9,10]
const checkoutService = new CheckoutService();
const steps = [
    {
        id: 'contact',
        status: 'complete',
        current: true,
        title: 'Contact Information',
        description: 'Enter your contact information',
        href: '#',
        handler: true
    },
    {
        id: 'billing',
        status: 'upcoming',
        current: false,
        title: 'Billing Information',
        description: 'Enter your billing information',
        href: '#',
        handler: true
    },
    {
        id: 'review',
        current: false,
        status: 'upcoming',
        title: 'Review',
        description: 'Review & complete order',
        href: '#',
        handler: true
    }
] as IStep[];
export interface ICheckoutStore {
    steps: IStep[];
    stepChanged: IStep|null;
    paymentMethods: IPaymentMethod[];
    shippingMethods: IShippingMethod[];
    config: IStoreConfig;
}
export const checkoutStore = atom<ICheckoutStore>({
    steps,
    stepChanged: null,
    paymentMethods: [],
    shippingMethods: [],
    config: {} as IStoreConfig,
});

onMount(checkoutStore, () => {
    // go get the config
    task(async () => {
        setHttpLoading(true);
        const res = await checkoutService.get();
        const store = checkoutStore.get();
        store.config = res.config;
        store.paymentMethods = res.paymentMethods || [];
        store.shippingMethods = res.shippingMethods || [];

        checkoutStore.set(store);
        setHttpLoading(false);
        return checkoutStore.get();
    });
});

export const setStepsAction = action(checkoutStore, 'setSteps', (store, id, status) => {
    const s = store.get();
    const steps = s.steps;
    const step = steps.find(s => s.id === id);
    if (!step) {
        return store.get();
    }

    step.status = status;
    store.set(s);
    return store.get();
});

export async function setPaymentMethod() {

}

export async function setShippingMethod() {

}

export async function completeOrder() {

}

export const handleStepChangeAction = action(checkoutStore, 'handleStepChange', (store, step) => {
    if (!step) {
        return store.get();
    }

    const s = store.get();
    const st = s.steps.find(st => st.id === step.id);
    if (!st) {
        return store.get();
    }


    // reset all
    s.steps.forEach(x => x.current = false);
    s.stepChanged = step;
    st.current = true;
    store.set(s);
    return store.get();
});
