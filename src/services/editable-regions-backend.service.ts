import {readFile} from "fs/promises";
import type {IEditableRegion, IEditableRegions} from "@models/editable-regions.model";

export class EditableRegionsBackendService {
    async load(): Promise<IEditableRegions> {
        const cached = await readFile(`__cache/editable-regions.json`)
        return JSON.parse(cached.toString());
    }

    async getLayout(layout: string): Promise<IEditableRegion[]> {
        const all = await this.load();

        return all[layout];
    }

    async getRegion(layoutName: string, region: string): Promise<IEditableRegion> {
        const layout = await this.getLayout(layoutName);
        const found =  layout.find((r: any) => r.region === region);
        if (!found) {
            return {} as IEditableRegion;
        }

        return found;
    }

    getRegionFromLayout(layout: IEditableRegion[], region: string): IEditableRegion {
        const found =  layout.find((r: any) => r.region === region);
        if (!found) {
            return {} as IEditableRegion;
        }

        return found;
    }

}
