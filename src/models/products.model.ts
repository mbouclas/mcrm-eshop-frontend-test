export interface IBaseModelEs {
    id: string;
    title: string;
    slug: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPropertyEs {
    uuid: string;
    name: string;
    slug: string;
    type: 'color'|'text';
    code?: string;
    value?: string;
    image?: string;
}

export interface IVariantEs {
    uuid: string;
    title: string;
    slug: string;
    price: number;
    color: string;
    variantId: string;
    sku: string;
    updateAd: Date;
    image?: string;
}

export interface IProductCategoryEs {
    uuid: string;
    title: string;
    slug: string;
    children: IProductCategoryEs[];
}

export interface ITagEs {
    uuid: string;
    title: string;
    slug: string;
}

export interface IProductManufacturerEs {
    id: string;
    title: string;
    slug: string;
}

export interface IImageEs {
    uuid: string;
    url: string;
    caption?: string;
    alt?: string;
    title?: string;
}

export interface IProductModel extends IBaseModelEs  {
    price: number;
    sku: string;
    thumb?: string;
    properties: IPropertyEs[];
    variants: IVariantEs[];
    tags: ITagEs[];
    categories: IProductCategoryEs[];
    manufacturer: IProductManufacturerEs;
    images: IImageEs[];
}

export interface IAggregationBucket {
    key: string;
    results: IAggregation[];
}
export interface IAggregation {
    key: string;
    slug?: string;
    doc_count: number;
}
export interface ICategoryWithAggregations {
    aggregations: IAggregation[];
    data: IProductModel[];
}

export interface IPropertyValue {
    name: string;
    icon?: string;
    image?: string;
    color?: string;
    code?: string;
    slug?: string;
    value?: string;
}

export interface IProductColorForSelectorVariant {
    uuid: string;
    variantId: string;
    image: string;
    color: string;
}
export interface IProductColorForSelector {
    color: string,
    image?: string
    variant: IProductColorForSelectorVariant;
    code: string;
    name: string;
    slug: string;
}

export interface IAggregation {
    key: string;
    results?: Results[];
}
export interface Results {
    key: string;
    doc_count: number;
    slug: string;
    to: number;
    from: number;
}
export interface ISearchResult {
    aggregations?: (IAggregation)[] | null;
    data?: (Data)[] | null;
    total: number;
    from: number;
    limit: number;
    page: number;
    pages: number;
    initialSearch: boolean;
}
export interface Data {
    sku: string;
    slug: string;
    title: string;
    id: string;
    price: number;
    thumb: string;
    description: string;
    createdAt: string;
    properties?: (Properties)[] | null;
    variants?: (Variants)[] | null;
    images?: Images[] | null;
    categories?: (Categories)[] | null;
}
export interface Properties {
    propertyUuid: string;
    propertyName: string;
    type: string;
    propertySlug: string;
    slug: string;
    uuid: string;
    name: string;
    code: string;
    color: string;
    image: string;
}
export interface Variants {
    uuid: string;
    title: string;
    slug: string;
    price: number;
    sku: string;
    variantId: string;
    image: string;
    color: string;
    material: string;
}
export interface Images {
    uuid: string;
    url: string;
}
export interface Categories {
    uuid: string;
    title: string;
    slug: string;
}


export interface IPropertiesStore {
    colors: IPropertyEs[];
    materials: IPropertyEs[];
}

export interface IModalStore {
    id: string;
    shown: boolean;
    items: {[key: string]: boolean};
}

export interface ISort {
    sort: string;
    way: string;
}
