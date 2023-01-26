import {readFile} from 'fs/promises';
export class ProductsService {
    async load() {
        const cached = await readFile(`__cache/all_products.json`)
        return JSON.parse(cached.toString());
    }
}
