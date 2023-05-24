import {BaseHttpService} from "@services/base-http.service";
import type {ISearchResult} from "@models/products.model";
import {httpLoading} from "@stores/http.store";
import type {IGenericObject} from "@models/general";

export class SearchService extends BaseHttpService {
    protected endpoint = `${import.meta.env.PUBLIC_SEARCH_ENDPOINT}`;
    async simpleSearch(query: string) {
        const res =  await this.search([{q: query}])
        return res.data || [];
    }

    async search(filters: IGenericObject[] = []) {
        httpLoading.set(true);
        let qs = filters.map(filter => {
            const key = Object.keys(filter)[0];

            return (!Array.isArray(filter[key])) ? `${key}=${filter[key]}` : filter[key].map((v: any) => `${key}[]=${v}`).join('&');
        }).join(`&`);

        const res = await fetch(`${this.endpoint}?${qs}`,
            {
                method: 'GET',
                headers: this.setHeaders()
            });

        httpLoading.set(false);
        return await res.json();


    }
}
