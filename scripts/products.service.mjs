import {BaseService} from "./base.service.mjs";
import {readFile} from "fs/promises";

export class ProductsService extends BaseService {
    async getProducts(limit = 10) {
        let allProducts = [];
        const rels = 'rels[]=propertyValues&rels[]=properties&rels[]=category&rels[]=manufacturer&rels[]=variants&rels[]=images&rels[]=tags';
        const res = await fetch(`${this.apiUrl}products?limit=${limit}&${rels}`);
        const data = await res.json();
        allProducts = allProducts.concat(data.data);

        for (let idx = 1; idx < data.pages; idx++) {
            const r = await fetch(`${this.apiUrl}products?page=${idx+1}&limit=${limit}&${rels}`);
            const d = await r.json();
            console.log(`*** Products page ${idx+1} complete`);
            allProducts = allProducts.concat(d.data);
        }


        return allProducts;
    }

    async find(filters = {}, page = 1, limit = 1000) {
        let appliedFilters = '';
        if (Object.keys(filters).length > 0) {
            appliedFilters = '&' + this.convertFiltersObjectToUrl(filters).join('&');
        }

        // console.log(`${this.apiUrl}search?limit=${limit}&page=${page}${appliedFilters}`)
        const query = await fetch(`${process.env.API_ES_URL}?limit=${limit}&page=${page}${appliedFilters}&aggSize=100&sort=updatedAt&way=desc`, {
            method: 'GET',
            headers: {
                "x-astro-key": process.env.ASTRO_KEY
            },
            redirect: 'follow'
        });
        return await query.json();
    }

    async getProductsFromEs(limit= 40, filters = {}) {
        const res = {
            aggregations: [],
            data: [],
        };


        const firstPage = await this.find(filters);

        res.aggregations = firstPage.aggregations;
        res.data = res.data.concat(firstPage.data);


        for (let idx = 1; firstPage.pages > idx; idx++) {
            const pageNumber = idx+1;
            const page = await this.find(filters, pageNumber);
            res.data = res.data.concat(page.data);
        }

        return res;
    }

    async getCategories() {
        const res = await fetch(`${this.apiUrl}products/categories`);
        return await res.json();
    }

    async getProductsPerCategory(slug) {
        const res = await this.getProductsFromEs(100, {categories: [slug]});
        return res;
    }

    async getProductsPerCategories() {
        const buffer = await readFile(`__cache/all_categories.json`);
        const cached = JSON.parse(buffer.toString());
        const res = {};
        for (let idx = 0; idx < cached.length; idx++) {
            res[cached[idx].slug] = await this.getProductsPerCategory(cached[idx].slug);
            console.log('****', cached[idx].slug, 'complete');
            if (Array.isArray(cached[idx].children) && cached[idx].children.length > 0) {
                for (let idx2 = 0; idx2 < cached[idx].children.length; idx2++) {
                    res[cached[idx].children[idx2].slug] = await this.getProductsPerCategory(cached[idx].children[idx2].slug);
                    console.log('****', cached[idx].children[idx2].slug, 'complete');
                }
            }
        }


        return res;
    }

    convertFiltersObjectToUrl(filters) {
        const appliedFilters = [];
        for (let key in filters) {
            if (!Array.isArray(filters[key])) {
                appliedFilters.push(`${key}=${filters[key]}`);
                continue;
            }

            filters[key].forEach(val => {
                appliedFilters.push(`${key}[]=${val}`);
            });
        }

        return appliedFilters;
    }
}

