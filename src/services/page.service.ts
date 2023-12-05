import {readFile} from "fs/promises";

export class PageService {
    async load() {
        const cached = await readFile(`__cache/all_pages.json`)
        return JSON.parse(cached.toString());
    }
}
