import {readFile} from "fs/promises";
import type {IGenericObject} from "@models/general";
import {extractSingleFilterFromObject} from "@helpers/data.helpers";

export class PropertiesService {
    async load() {
        const cached = await readFile(`__cache/all_properties.json`)
        return JSON.parse(cached.toString());
    }

    async findOne(filter: IGenericObject) {
        const {key, value} = extractSingleFilterFromObject(filter);

        const data = await this.load();
        return data.find((d: any) => d[key] === value);
    }

    async getPropertyValues(filter: IGenericObject) {
        const {key, value} = extractSingleFilterFromObject(filter);
        const parent = await this.findOne(filter);

        if (!parent['propertyValue']) {
            return null;
        }

        return parent['propertyValue'];
    }

    findValue(propertyValues: any[],  childFilter: IGenericObject) {
        const childFilters = extractSingleFilterFromObject(childFilter);

        return propertyValues.find((d: any) => d[childFilters.key] === childFilters.value);
    }
}
