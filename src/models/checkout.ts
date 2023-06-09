import type {IUser} from "@models/user.model";
import type {ICartItem} from "@stores/cart.store";

export interface IStep {
    id: string;
    title: string;
    description: string;
    href: string;
    current: boolean;
    status: 'current' | 'upcoming' | 'complete';
    handler: boolean;
}

export interface IConvertGuestToUserEvent {
    decision: 'register'|'guest';
    data?: IUser;
}

export interface IOrderMetaData {
    notes?: string;
    preferredDeliveryDate?: Date;
}

export interface IGuestContactInformation {
    email: string;
    phone: string;
}

export interface IOrderResponse {
    message: string;
    success: boolean;
    order: string;
    items: ICartItem[];
}
