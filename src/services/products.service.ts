import {readFile} from 'fs/promises';
import type {ICategoryWithAggregations, IProductCategoryEs, IProductModel} from "@models/products.model";
import {sortBy} from "@helpers/general";
import type {IGenericObject} from "@models/general";
import {extractSingleFilterFromObject} from "@helpers/data.helpers";

export interface IBestSeller {
    product: IProductModel;
    numberOfPurchases: number;
    productId: string;
}

export class ProductsService {
    async load() {
        const cached = await readFile(`__cache/all_products.json`)
        return JSON.parse(cached.toString());
    }

    async bestSellers(limit = 5): Promise<IBestSeller[]> {
        const buffer = await readFile(`__cache/best-sellers.json`);
        const loaded = JSON.parse(buffer.toString());
        const toReturn = loaded.slice(0, limit);
        const all = await this.load();
        for (const item of toReturn) {
            const found = await this.findOne({id: item.productId}, all);
            item.product = found;
        }

        return toReturn;
    }

    async findOne(filter: IGenericObject, all?: any[]) {
        if (!all) {
            all = await this.load();
        }
        const {key, value} = extractSingleFilterFromObject(filter);

        // @ts-ignore
        return all.find((p: IProductModel) => p[key] === value);
    }

    async loadAllAggregations() {
        const cached = await readFile(`__cache/all_aggregations.json`)
        return JSON.parse(cached.toString());
    }

    filterProductsByCategory(filter: IGenericObject, products: IProductModel[]) {
        const {key, value} = extractSingleFilterFromObject(filter);
        const filteredProducts = products.filter((p: IProductModel) => {
            if (!Array.isArray(p.categories)) {
                return false;
            }

            // @ts-ignore
            return  p.categories.findIndex((c: IProductCategoryEs) => c[key] === value) !== -1;
        });

        return sortBy(filteredProducts, 'updatedAt', 'desc');
    }

    async getCategoryProductsWithAggregations(slug: string, sort = 'updatedAt', way = 'desc'): Promise<ICategoryWithAggregations> {
        const cached = await readFile(`__cache/category_${slug}.json`)
        const res = JSON.parse(cached.toString());

        res.data = sortBy(res.data, 'updatedAt', 'desc');

        return res;
    }

    async categories(flatten = false): Promise<Partial<IProductCategoryEs>[]> {
        const cached = await readFile(`__cache/all_categories.json`)
        if (!flatten) {
            return JSON.parse(cached.toString());
        }

        const data = JSON.parse(cached.toString());
        const flattenData: Partial<IProductCategoryEs>[] = [];
        // recursively flatten the data
        const flattenCategories = (categories: Partial<IProductCategoryEs>[]) => {
            categories.forEach((c) => {
                flattenData.push(c);
                if (c.children) {
                    flattenCategories(c.children);
                }
            });
        };

        flattenCategories(data);

        return flattenData;

    }
}
