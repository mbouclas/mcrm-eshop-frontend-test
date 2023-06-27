import {BaseService} from "./base.service.mjs";
export class EditableRegionsService extends BaseService {
    async getEditableRegions() {
        const res = await fetch(`${this.apiUrl}website/editable-regions?groupBy=layout`);
        return await res.json();
    }
}
