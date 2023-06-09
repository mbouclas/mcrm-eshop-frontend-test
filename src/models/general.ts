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
    baseCost?: number;
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
    providerName: string;
    paymentInformation?: IGenericObject;
    selectedShippingMethod?: IShippingMethod|null;
    shippingMethod: IShippingMethod[];
}
export interface IStoreConfig {
    quickCheckout: boolean;
    guestCheckout: boolean;
}

export interface IOtp {
    id: string;
    otp: string;
    success: boolean;
}

export interface IEvent<T> extends Event {
    detail: T;
}

export interface IAlertsStore {
    title?: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    timeout?: number;
    position?:  'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}
