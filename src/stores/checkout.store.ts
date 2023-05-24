import {atom, action, task, onMount} from 'nanostores';
import {setHttpLoading} from "@stores/http.store";
import type {IStep} from "@models/checkout";
import {CheckoutService} from "@services/checkout.service";
import type {IPaymentMethod, IShippingMethod, IStoreConfig} from "@models/general";
import type {IAddress, IUser} from "@models/user.model";
export const cartQuantities = [1,2,3,4,5,6,7,8,9,10]
const checkoutService = new CheckoutService();

const steps = [
    {
        id: 'contact',
        status: 'current',
        current: true,
        title: 'Contact Information',
        description: 'Enter your contact information',
        href: '#',
        handler: true
    },
    {
        id: 'shipping',
        status: 'upcoming',
        current: false,
        title: 'Shipping Information',
        description: 'Enter your shipping information',
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
        id: 'payment',
        current: false,
        status: 'upcoming',
        title: 'Payment',
        description: 'Select your payment method',
        href: '#',
        handler: true
    }
] as IStep[];

export interface IGuestContactInformation {
    email: string;
    phone: string;
}

export interface ICheckoutStore {
    steps: IStep[];
    stepChanged: IStep|null;
    paymentMethods: IPaymentMethod[];
    shippingMethods: IShippingMethod[];
    shippingInformation: IAddress;
    billingInformation: IAddress;
    contactInformation: IAddress|IGuestContactInformation;
    paymentMethod: IPaymentMethod;
    config: IStoreConfig;
    guestUser?: IUser;
}

export const checkoutStore = atom<ICheckoutStore>({
    steps,
    stepChanged: null,
    paymentMethods: [],
    shippingMethods: [],
    shippingInformation: {} as IAddress,
    contactInformation: {} as IAddress|IGuestContactInformation,
    billingInformation: {} as IAddress,
    paymentMethod: {} as IPaymentMethod,
    config: {} as IStoreConfig,
    guestUser: {} as IUser,
});

onMount(checkoutStore, () => {
    // go get the config
    task(async () => {
        const res = await checkoutService.get();
        const store = checkoutStore.get();
        store.config = res.config;
        store.paymentMethods = res.paymentMethods || [];
        store.shippingMethods = res.shippingMethods || [];

        checkoutStore.set(store);

        return checkoutStore.get();
    });
});

checkoutStore.subscribe((state) => {
    localStorage.setItem('checkout', JSON.stringify(state));
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

export const setContactInformationAction = action(checkoutStore, 'setContactInformation', (store, contactInformation) => {
    const s = store.get();
    s.contactInformation = contactInformation;
    store.set(s);
    return store.get();
});

export const setShippingInformationAction = action(checkoutStore, 'setShippingInformation', (store, shippingInformation) => {
    const s = store.get();
    s.shippingInformation = shippingInformation;
    store.set(s);
    return store.get();
});

export const setBillingInformationAction = action(checkoutStore, 'setBillingInformation', (store, billingInformation) => {
    const s = store.get();
    s.billingInformation = billingInformation;
    store.set(s);
    return store.get();
});

export const setPaymentMethodAction = action(checkoutStore, 'setPaymentMethod', (store, paymentMethod) => {
    const s = store.get();
    s.paymentMethod = paymentMethod;
    store.set(s);
    return store.get();
});

export const setGuestUserAction = action(checkoutStore, 'setGuestUser', (store, guestUser) => {
    const s = store.get();
    s.guestUser = guestUser;
    store.set(s);
    return store.get();
});

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
