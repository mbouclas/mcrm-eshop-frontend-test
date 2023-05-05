import {BaseService} from "./base.service.mjs";

export class PropertiesService extends BaseService {
    async get(limit = 10)  {
        let all = [];
        const rels = `rels[]=propertyValues`;
        const res = await fetch(`${this.apiUrl}properties?limit=${limit}&${rels}`);

        const data = await res.json();
        all = all.concat(data.data);

        for (let idx = 1; idx < data.pages; idx++) {
            const r = await fetch(`${this.apiUrl}properties?page=${idx+1}&limit=${limit}&${rels}`);
            const d = await r.json();
            console.log(`*** Properties page ${idx+1} complete`);
            all = all.concat(d.data);
        }


        return all;
    }
}
