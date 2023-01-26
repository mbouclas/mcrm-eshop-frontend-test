import {BaseService} from "./base.service.mjs";

export class ProductsService extends BaseService {
    async getProducts(limit = 10) {
        let allProducts = [];
        const rels = 'rels[]=category&rels[]=manufacturer&rels[]=variants';
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
}
