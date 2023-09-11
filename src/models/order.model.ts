export interface ICouponApplied {

}
export interface IOrderFromHistory {
    id: string;
    metaData: ICartMetaData;
    shippingStatus: number;
    createdAt: string;
    updatedAt: string;
    status: number;
    paymentStatus: number;
    total: number;
}
export interface ICart {
    id: string;
    items?: (Items)[] | null;
    total: number;
    numberOfItems: number;
    subTotal: number;
    vatRate: number;
    metaData: ICartMetaData;
    appliedConditions?: any[] | null;
    couponApplied: ICouponApplied;
}
export interface Items {
    productId: string;
    variantId: string;
    quantity: number;
    sku: string;
    slug: string;
    price: number;
    metaData: ICartMetaData;
    title: string;
    thumb: string;
    uuid: string;
}
export interface IColor {
    color: string;
    image?: null;
    code: string;
    name: string;
    slug: string;
    variant: IProductVariant;
}
export interface IProductVariant {
    uuid: string;
    variantId: string;
    image: string;
    color: string;
}
export interface ICartMetaData {
    color: IColor;
    cart: ICart;
    uploadedFiles?: IUploadedFiles[] | null;
}
export interface IUploadedFiles {
    description: string;
    filename: string;
    originalName: string;
    id: string;
}
export interface IOrderQueryResponse {
    data: IOrderFromHistory[];
    limit: number;
    page: number;
    pages: number;
    total: number;
    skip: number;
}


export interface IOrderStatus {
    id: number;
    label: string;
    color?: string;
}
