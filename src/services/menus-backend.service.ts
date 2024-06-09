import {readFile} from "fs/promises";
import type {IMenu} from "@models/menus.model";

export class MenusBackendService {
    async load(): Promise<IMenu[]> {
        const cached = await readFile(`__cache/menus.json`)
        return JSON.parse(cached.toString());
    }

    async getMenu(slug: string): Promise<IMenu> {
        const all = await this.load();
        const found = all.find((m: any) => m.slug === slug);
        if (!found) {
            return {} as IMenu;
        }

        return found;
    }
}

