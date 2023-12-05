import type {IImageEs, IProductCategoryEs, ITagEs} from "@models/products.model.ts";

export interface IPageModel {
    slug: string;
    uuid: string;
    title: string;
    description: string;
    description_long: string;
    excerpt: string;
    thumb?: IImageEs;
    tags: ITagEs[];
    images: IImageEs[];
    pageCategory: IProductCategoryEs[];
}
