import type {IGenericObject} from "@models/general";

export interface IMenu {
    title: string;
    uuid: string;
    slug: string;
    menuItem?: IMenuItem[];
}
export interface IMenuItem {
    itemId: string;
    active: boolean;
    title: string;
    permalink: string;
    uuid: string;
    slug: string;
    order: number;
    children?: IMenuItem[]
    link: string;
    metaData?: IGenericObject;
}

