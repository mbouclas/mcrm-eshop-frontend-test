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
    value?: string;
}
