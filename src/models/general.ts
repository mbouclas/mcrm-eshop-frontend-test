export interface IGenericObject<T = any> {
    [key: string]: T;
}

export interface IShippingMethod {
    code: string;
    shippingTime: string;
    title: string;
    uuid: string;
    slug: string;
    status: boolean;
}
export interface IStoreInitialQuery {
    shippingMethods?: (IShippingMethod)[] | null;
    paymentMethods?: (IPaymentMethod)[] | null;
    config: IStoreConfig;
    test: number;
}
export interface IPaymentMethod {
    surcharge: number;
    title: string;
    uuid: string;
    slug: string;
    status: boolean;
}
export interface IStoreConfig {
    quickCheckout: boolean;
    guestCheckout: boolean;
}
