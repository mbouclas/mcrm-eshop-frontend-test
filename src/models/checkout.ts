import type {IUser} from "@models/user.model";

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
