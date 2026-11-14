# CLAUDE.md

@AGENTS.md

## Project state

Deissy Olarte's personal site, at https://turesiliencia.com. The association TuResiliencia has its own site at https://www.turesiliencia.org, in the sibling repository `../turesiliencia-org` (`Turesiliencia/web`): keep the two apart. This one is in her first-person voice; the `.org` speaks for the association.

It is a static Astro site in Spanish, rebuilt from her old WordPress site (gone since 2026-11-13). Its pages:

| Address       | File                     | What it is                                                               |
| ------------- | ------------------------ | ------------------------------------------------------------------------ |
| `/`           | `src/pages/index.astro`  | Home: hero, about her, the three latest posts, the book, contact         |
| `/miblog/`    | `src/pages/miblog/`      | Every published post, newest first (the same address as on WordPress)    |
| `/<slug>/`    | `src/pages/[slug].astro` | A post, at the address it had on WordPress, then three more and the book |
| anything else | `src/pages/404.astro`    | Not found, with links home and to the blog; the old pages land here too  |

Her other old pages (Mi historia, Tarifas, Temarios, Tu videoconferencia) are not rebuilt yet. The blog posts come from Sanity (below); everything else is in the code. Her contact details and the book's Amazon links are in `src/content/site.ts`, the same as the `.org`'s (`src/content/site.ts` and `src/content/book.ts` there): change both sites together. `../CLAUDE.md` lists everything the two share. It is indexable, unlike the `.org`, with a sitemap (`@astrojs/sitemap`) and `public/robots.txt`.

It is live at https://turesiliencia.com since 2026-11-13 (Vercel project `turesiliencia-com` on her account, deployed on every push to `main`). The domain is registered at Vercel with Vercel's nameservers; `www` redirects to the bare domain (308), and https://deissy-olarte.vercel.app still serves the site too. The site's own address (canonical links, link-preview tags, sitemap) comes from `site` in `astro.config.mjs`, which takes Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time (the shortest production domain, now `turesiliencia.com`): after changing the project's domains, redeploy. Local builds fall back to `turesiliencia.com`.

Private context (the state of both sites, decisions, her material, the backup of the old site) is not in this repository. It lives one level up, in the folder that holds both sites and is in no repository: `../CLAUDE.md`, `../CLAUDE.local.md`, `../notes/` and `../refs/` (her old site's posts and pages as Markdown are in `../refs/com/`; how the site left WordPress is `../notes/com-migration.md`). Read `../CLAUDE.local.md` before writing content.

## Commands

```bash
npm run dev      # dev server on http://localhost:4321
npm run build    # static build into dist/ (fetches the posts from Sanity)
npm run preview  # serve the build
```

Astro 7 wants Node 22.23 or later; `.nvmrc` pins 24, as Vercel builds with: run `nvm use` first where the default Node is older. No test runner, no linter.

To look at a page without a browser, serve the build (`npx astro preview --port 3458`) and screenshot it with headless Chrome at a desktop and a phone width. Pages are longer than a screen: use a tall window (about 4300 px at 1440 wide, 7600 px at 390 for the home page):

```bash
google-chrome --headless=new --hide-scrollbars --force-prefers-reduced-motion --virtual-time-budget=6000 \
  --window-size=390,7600 --screenshot=/path/outside/the/repo/mobile.png http://localhost:3458/
```

Stop the preview server afterwards (`npx astro preview stop`, or by its PID from `ss -ltnp | grep 3458`).

## The posts, in Sanity

- **Where**: Sanity project `qnm95gjz`, dataset `production` (public: anyone can read published documents; drafts need a login), owned by her Sanity account (the "Turesiliencia" GitHub login). Free plan.
- **The Studio** is in `studio/`, a separate npm package that neither Astro nor Vercel builds: `cd studio && npm install && npm run dev` (http://localhost:3333), `npm run deploy` to publish the hosted Studio. Its schema (`studio/schemaTypes/`) has one document type, `post` (title, slug, date, excerpt, cover image with alt text, body), and a `youtube` block for the body. Its labels are in Spanish, for her.
- **The site reads Sanity at build time only** (`src/lib/sanity.ts`, published perspective, no CDN so a build right after publishing sees the post), so the site stays fully static. A new or changed post goes live with the next deployment: a Sanity webhook calling a Vercel deploy hook is to start one on every publish (not set up yet).
- **The body** is Portable Text, turned into HTML by `src/lib/portable-text.ts` (`@portabletext/to-html`, which escapes the text; the image and YouTube blocks escape what they use). Its styles are under `.prose` in `src/pages/[slug].astro`.
- **Images** are served from Sanity's CDN in several widths (`imageAttrs` in `src/lib/sanity.ts`); cards crop to 3:2 following the hotspot set in the Studio. A post's link preview is its cover cropped to 1200×630 JPEG; pages without one use `public/social-card-book.png`.
- **Excerpts**: the post's own, or else its first paragraphs cut at about 180 characters.
- **The import from WordPress** (2026-11-14) is `studio/scripts/import-wordpress-posts.ts`, run once with `npx sanity exec … --with-user-token` from the Markdown in `../refs/com/markdown-blog/`. It writes fixed ids (`post-<slug>`, `drafts.post-<slug>`), so running it again replaces the posts, including any edits made in the Studio since.

## How it is built

- Static Astro, no adapter: Vercel detects it and serves `dist/`. `trailingSlash: "always"` in Astro and `vercel.json` keeps WordPress's addresses (`/<slug>/`); Vercel redirects the address without the slash.
- **Layout**: `src/layouts/BaseLayout.astro` (head, link-preview tags, JSON-LD, header, footer). Header and footer (`SiteHeader`, `SiteFooter`) are ported from the `.org`'s; their links are `nav` in `src/content/site.ts`.
- **Fonts and colours are the `.org`'s**: Cormorant Garamond and Montserrat through Astro's fonts API (`astro.config.mjs`, downloaded at build time and self-hosted), and the navy, gold and cream tokens in `src/styles/global.css`, which also holds the classes the pages share (`.section`, `.label`, `.title`, `.body-text`, `.button-primary`, `.button-secondary`, `.arrow-link`).
- **The lotus emblem** (`src/components/LogoEmblem.astro`) and **the Amazon icon** (`src/components/AmazonIcon.astro`, Simple Icons, CC0) are ported from the `.org`'s React components. The emblem appears several times on a page, so each copy takes an `id` prop for its gradient ids.
- **The book** (`src/components/BookSection.astro`) is on the home page and under every post.
- Styles that size a child component's SVG or image need `:global()`: Astro's scoped styles don't reach into another component's markup. The same goes for the post body, which is HTML from `set:html`.
- The book cover (`src/assets/`), favicon, touch icon and link preview (`public/social-card-book.png`) are copies of the `.org`'s files, metadata already stripped.

## Git and what can be committed

The repository `Turesiliencia/turesiliencia-com` is on Deissy's GitHub account and **public**: everything committed can be read by anyone, permanently. It is public because on Vercel's Hobby plan a private repository blocks deployments of commits not authored by the account owner. Commits are authored by `kevjrmy`; never author them as her.

Every push to `main` is a production deployment: run `npm run build` first. Kevin reviews before anything is published and says when to push.

The bar for anything committed: if Deissy has not already published it, it does not go in. Never commit `.env*`, nor anything copied from the private material one level up (`../CLAUDE.local.md`, `../notes/`, `../refs/`), except what she has published or asked to publish (`../notes/refs.md` says which). `refs/` and `CLAUDE.local.md` are gitignored here too, in case a copy ever lands in this folder. Images: cleared for publication, metadata stripped.

Before each commit, look at `git status`, add files by name, then:

```bash
git diff --cached --name-only | grep -Ei '^refs/|CLAUDE\.local|\.env|\.(pem|key|pdf|docx?|csv|xlsx?|ods)$'
git diff --cached | grep -Ei 'token|secret|password|api[_-]?key|BEGIN .*PRIVATE'
```

If either prints anything, stop and look. The second also matches "tokens" in this file whenever it is staged: that hit is expected.
