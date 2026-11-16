// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { getPostDates } from "./src/lib/sanity.ts";

// The address in canonical links, link-preview tags and the sitemap. On Vercel,
// the project's shortest production domain: turesiliencia.com.
const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = productionHost
  ? `https://${productionHost}`
  : "https://turesiliencia.com";

// When each post last changed, for the sitemap: search engines use it to
// decide what to read again. Only posts: the other pages have no such date.
const postDates = await getPostDates();

// https://astro.build/config
export default defineConfig({
  site,
  // Posts keep the addresses they had on WordPress, which end in a slash.
  trailingSlash: "always",
  integrations: [
    sitemap({
      serialize(item) {
        const slug = new URL(item.url).pathname.replaceAll("/", "");
        const lastmod = postDates.get(slug);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  // Downloaded at build time and served from the site itself. Fraunces for
  // display is hers (the .org's is Cormorant Garamond); Montserrat for text is
  // the logo's typeface, shared with the .org.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Fraunces",
      cssVariable: "--font-fraunces",
      weights: [400, 500, 600],
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
