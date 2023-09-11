import dotenv from "dotenv"
import { defineConfig } from 'astro/config';
import critters from "astro-critters";
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';
import partytown from "@astrojs/partytown";
import mdx from "@astrojs/mdx"

import svelte from "@astrojs/svelte";
import { VitePWA } from 'vite-plugin-pwa'
dotenv.config();
const integrations = [
    tailwind(),
  svelte(),
    mdx(),
    sitemap(),
  critters({critters: process.env.ENV === 'production'}),
    ];
/*if (process.env.ENV === 'production') {
  integrations.push(partytown())
}*/
// https://astro.build/config
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
