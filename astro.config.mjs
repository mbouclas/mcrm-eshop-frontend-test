import dotenv from "dotenv"
import { defineConfig } from 'astro/config';
import critters from "astro-critters";
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';
import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx"
import robotsTxt from "astro-robots-txt";
import favicons from "astro-favicons";
// import markdownIntegration from '@astropub/md'
import playformInline from "@playform/inline";
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
  // markdownIntegration(),
  sitemap(),
  robotsTxt(),
  favicons({
    masterPicture: "./public/logo.png",
    appName: process.env.APP_NAME,
    appShortName: process.env.APP_SHORT_NAME,
    appDescription: process.env.APP_DESCRIPTION,
    background: "#ffffff",
    theme_color: "#ffffff",
    faviconsDarkMode: false,
  }),
  playformInline({
    critters: env === 'production'
  }),
  // critters({critters: env === 'production'}),
];
/*if (process.env.ENV === 'production') {
  integrations.push(partytown())
}*/
// https://astro.build/config
console.log(env, process.env.SITE_BASE_URL)
export default defineConfig({
  image: {
    domains: ['res.cloudinary.com']
  },
  site: process.env.SITE_BASE_URL,
  vite: {
    plugins: [

    ],
    ssr: {
      external: ["svgo"]
    }
  },
  experimental: {
    contentCollectionCache: true,
  },
  integrations
});
