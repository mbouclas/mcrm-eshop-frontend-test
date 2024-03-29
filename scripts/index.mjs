import dotenv from "dotenv"
dotenv.config()

import { loadEnv } from "vite"
import fs from "fs"
import { writeFile } from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import {ProductsService} from "./products.service.mjs";
import {PropertiesService} from "./properties.service.mjs";
import {MenuService} from "./menu.service.mjs";
import {EditableRegionsService} from "./editable-regions.service.mjs";
import {PagesService} from "./pages.service.mjs";
const __filename = fileURLToPath(import.meta.url)
const { API_BASE_URL, ASTRO_KEY } = loadEnv("production", process.cwd(), "")
const __dirname = dirname(__filename)

const cacheFolderLocation = join(__dirname, "../", "__cache")

if (process.env.USE_CACHE && process.env.USE_CACHE === "true") {
    process.exit()
}


if (!fs.existsSync(cacheFolderLocation)) {
    fs.mkdirSync(cacheFolderLocation)
}
const timeStart = Date.now();
Promise.all([
    saveHome(),
    saveAllProducts(),
    saveAllProperties(),
    saveProductCategories(),
    saveProductPerCategories(),
    saveMenus(),
    saveContent(),
    saveContentCategories(),
    saveEditableRegions(),
    saveAllPages()
]).then(() => {
    console.log(`* All done in ${Date.now() - timeStart}ms`);
    process.exit();
});

/*await saveHome();
await saveAllProducts();
await saveAllProperties();
await saveProductCategories();
await saveProductPerCategories();
await saveMenus();
await saveContent();
await saveContentCategories();
await saveEditableRegions();
await saveAllPages();
console.log(`* All done in ${Date.now() - timeStart}ms`);
process.exit();

 */
async function saveAllProducts() {
    const s = new ProductsService();
    // const items = await s.getProducts(100);
    const data = await s.getProductsFromEs(100);
    try {
        await writeFile(
            join(cacheFolderLocation, `all_products.json`),
            JSON.stringify(data.data)
        )

    } catch (e) {
        console.log(e)
    }

    try {
        await writeFile(
            join(cacheFolderLocation, `all_aggregations.json`),
            JSON.stringify(data.aggregations)
        )

    } catch (e) {
        console.log(e)
    }

    console.log(`* Saving All products complete`)
}

async function saveAllPages() {
    const s = new PagesService();
    const items = await s.getPages();
    try {
        await writeFile(
            join(cacheFolderLocation, `all_pages.json`),
            JSON.stringify(items)
        )
        console.log(`* Saving All pages complete`)
    } catch (e) {
        console.log(e)
    }
}

async function saveAllProperties() {
    const s = new PropertiesService();
    const items = await s.get(100);
    try {
        await writeFile(
            join(cacheFolderLocation, `all_properties.json`),
            JSON.stringify(items)
        )
        console.log(`* Saving All properties complete`)
    } catch (e) {
        console.log(e)
    }
}

async function saveProductCategories() {
    const s = new ProductsService();
    const items = await s.getCategories();
    try {
        await writeFile(
            join(cacheFolderLocation, `all_categories.json`),
            JSON.stringify(items)
        )
        console.log(`* Saving All categories complete`)
    } catch (e) {
        console.log(e)
    }
}

async function saveProductPerCategories() {
    const s = new ProductsService();
    const items = await s.getProductsPerCategories();
    for (const key in items) {
        try {
            await writeFile(
                join(cacheFolderLocation, `category_${key}.json`),
                JSON.stringify(items[key])
            )
            console.log(`* Saving All ${key} complete`)
        } catch (e) {
            console.log(e)
        }
    }

}

async function saveMenus() {
    const s = new MenuService();
    const items = await s.getMenus();
    try {
        await writeFile(
            join(cacheFolderLocation, `menus.json`),
            JSON.stringify(items.data)
        )
    } catch (e) {
        console.log(e)
    }
    console.log(`* Saving All menus complete`)
}

async function saveContent() {
    console.log(`* Saving All content complete`)
}
async function saveContentCategories() {
    console.log(`* Saving All content categories complete`)
}

async function saveEditableRegions() {
    const s = new EditableRegionsService();

    const items = await s.getEditableRegions();
    try {
        await writeFile(
            join(cacheFolderLocation, `editable-regions.json`),
            JSON.stringify(items)
        )
    } catch (e) {
        console.log(e)
    }
    console.log(`* Saving All Editable Regions complete`)
}

async function saveHome() {
    const s = new ProductsService();
    // const items = await s.getProducts(100);
    const data = await s.getBestSellers(10);
    try {
        await writeFile(
            join(cacheFolderLocation, `best-sellers.json`),
            JSON.stringify(data)
        )

    } catch (e) {
        console.log(e)
    }


    console.log(`* Saving Home complete`)
}
