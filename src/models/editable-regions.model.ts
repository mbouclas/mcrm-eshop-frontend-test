import type {IGenericObject} from "@models/general";

export interface IEditableRegions {
    [key: string]: IEditableRegion[];
}

export interface IEditableRegion {
    uuid: string;
    layout: string;
    region: string;
    items: IEditableRegionItem[];
    settings: IGenericObject;
}

export interface IEditableRegionItem {
    model: string;// The model name
    settings?: IGenericObject;
    modelSettings?: IEditableRegionItemModelSettings;
    item: IEditableRegionItemReference;
}

export interface IEditableRegionItemModelSettings {
    limit?: number;
    orderBy?: string;
    way?: 'ASC'|'DESC';
    filter?: IGenericObject;
    filterKey?: string;
    rels?: string[];
}

export interface IEditableRegionItemReference {
    uuid: string;
    title: string;
    slug: string;
    metaData?: IGenericObject;
}
