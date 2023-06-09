import {atom, action, task, onMount} from 'nanostores';
import type {IGuestContactInformation, IOrderMetaData, IOrderResponse, IStep} from "@models/checkout";
import {CheckoutService} from "@services/checkout.service";
import type {IPaymentMethod, IShippingMethod, IStoreConfig} from "@models/general";
import type {IAddress, IUser} from "@models/user.model";
import {cart, clearCart, ICartItem} from "@stores/cart.store";
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
        title: 'Finalize Order',
        description: 'Review and submit your order',
        href: '#',
        handler: true
    }
] as IStep[];




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
    orderMetaData?: IOrderMetaData;
    useBillingInformation: boolean;
    latestOrder?: IOrderResponse;
}

const checkoutStoreDefaults = {
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
    useBillingInformation: false,
    orderMetaData: {} as IOrderMetaData,
    latestOrder: {} as IOrderResponse,
};
export const checkoutStore = atom<ICheckoutStore>(checkoutStoreDefaults);

onMount(checkoutStore, () => {
    let cached = localStorage.getItem('checkout');
    if (cached) {
        try {
            const data = JSON.parse(cached);
            checkoutStore.set(data);
        } catch (e) {
            console.log(e);
        }
    }
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


export const setUseSameAsShippingAction = action(checkoutStore, 'setUseBillingInformation', (store, useBillingInformation) => {
    const s = store.get();
    s.useBillingInformation = useBillingInformation;
    store.set(s);
    return store.get();
})

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

export const resetCheckoutAction = action(checkoutStore, 'resetCheckout', (store) => {
    store.set(checkoutStoreDefaults);
    return store.get();
});

export const setCheckoutDoneAction = action(checkoutStore, 'setCheckoutDone', async (store, latestOrder: IOrderResponse) => {
    latestOrder.items = cart.get().items as ICartItem[];
    store.set({ ...checkoutStoreDefaults, ...{latestOrder}});

    await clearCart();

    return store.get();
});

export const setOrderMetaDataAction = action(checkoutStore, 'setOrderMetaData', (store, orderMetaData: IOrderMetaData) => {
    const s = store.get();
    s.orderMetaData = orderMetaData;
    store.set(s);
    return store.get();
});
