import dotenv from "dotenv"
dotenv.config()

import { loadEnv } from "vite"
import fs from "fs"
import { writeFile } from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import {ProductsService} from "./products.service.mjs";
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

await saveAllProducts();

async function saveAllProducts() {
    const s = new ProductsService();
    const items = await s.getProducts(100);
    try {
        await writeFile(
            join(cacheFolderLocation, `all_products.json`),
            JSON.stringify(items)
        )
        console.log(`* Saving All products complete`)
    } catch (e) {
        console.log(e)
    }
}
