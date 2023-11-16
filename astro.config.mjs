import dotenv from "dotenv"
import { defineConfig } from 'astro/config';
import critters from "astro-critters";
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';
import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx"

import svelte from "@astrojs/svelte";
import { VitePWA } from 'vite-plugin-pwa'
import {resolve} from "path";
import {statSync} from "node:fs";
let envPath = '.env';
const env = process.env.ENV ? process.env.ENV : process.env.NODE_ENV || 'development';
try {
  envPath = (statSync(resolve(`.env.${env}`))) ?  `.env.${env}` : '.env';
}
 catch (e) {

 }
dotenv.config({ path: resolve(process.cwd(), envPath)});
const integrations = [
    tailwind(),
  svelte(),
    mdx(),
    sitemap(),
  critters({critters: env === 'production'}),
    ];
/*if (process.env.ENV === 'production') {
  integrations.push(partytown())
}*/
// https://astro.build/config
console.log(env, process.env.SITE_BASE_URL)
export default defineConfig({
  site: process.env.SITE_BASE_URL,
  vite: {
    plugins: [

    ],
    ssr: {
      external: ["svgo"]
    }
  },
  integrations
});
