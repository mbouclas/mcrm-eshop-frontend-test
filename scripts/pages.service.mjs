import {BaseService} from "./base.service.mjs";

export class PagesService extends BaseService {
    async getPages(limit = 100) {
        let all = [];
        const res = await fetch(`${this.apiUrl}pages?limit=${limit}&with[]=*&active=true`);
        const data = await res.json();
        all = all.concat(data.data);

        for (let idx = 1; idx < data.pages; idx++) {
            const r = await fetch(`${this.apiUrl}pages?page=${idx+1}&limit=${limit}&with[]=*&active=true`);
            const d = await r.json();
            console.log(`*** Pages page ${idx+1} complete`);
            all = all.concat(d.data);
        }

        return all;
    }
}
