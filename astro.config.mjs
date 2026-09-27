// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL } from "./src/consts.ts";
import { isNoindexRoute } from "./src/utils/seo.ts";

export default defineConfig({
  site: SITE_URL,
  integrations: [
    sitemap({
      filter: (page) => !isNoindexRoute(new URL(page).pathname),
    }),
  ],
  fonts: [
    {
      /* Capriola ships a single weight. There is no bold to fall back on, so
         every heading sits at 400 and font synthesis is off, rather than
         letting a browser smear a fake bold at display sizes. */
      name: "Capriola",
      cssVariable: "--font-display",
      provider: fontProviders.google(),
      weights: [400],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      name: "Instrument Sans",
      cssVariable: "--font-body",
      provider: fontProviders.google(),
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin", "latin-ext"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
  vite: { build: { cssTarget: "safari15.4" } },
});
