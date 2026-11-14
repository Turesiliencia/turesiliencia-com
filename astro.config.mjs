// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

// The address in canonical links, link-preview tags and the sitemap. On Vercel,
// the project's shortest production domain: turesiliencia.com.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = productionHost
  ? `https://${productionHost}`
  : "https://turesiliencia.com";

// https://astro.build/config
export default defineConfig({
  site,
  // Posts keep the addresses they had on WordPress, which end in a slash.
  trailingSlash: "always",
  integrations: [sitemap()],
  // Same typefaces as turesiliencia.org, downloaded at build time and served
  // from the site itself.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant",
      weights: [500, 600],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Montserrat",
      cssVariable: "--font-montserrat",
      weights: [400, 500, 600],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
  ],
});
