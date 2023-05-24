import dotenv from "dotenv"
import { defineConfig } from 'astro/config';
import critters from "astro-critters";
import tailwind from "@astrojs/tailwind";
import compress from "astro-compress";
import partytown from "@astrojs/partytown";

import svelte from "@astrojs/svelte";
dotenv.config();
const integrations = [
    tailwind(),
  svelte(),
  critters({critters: process.env.ENV === 'production'}),
    ];
if (process.env.ENV === 'production') {
  integrations.push(partytown())
}
// https://astro.build/config
export default defineConfig({
  vite: {
    ssr: {
      external: ["svgo"]
    }
  },
  integrations
});
