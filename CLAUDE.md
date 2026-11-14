# CLAUDE.md

@AGENTS.md

## Project state

Deissy Olarte's personal site, at https://turesiliencia.com. The association TuResiliencia has its own site at https://www.turesiliencia.org, in the sibling repository `../turesiliencia-org` (`Turesiliencia/web`): keep the two apart. This one is in her first-person voice; the `.org` speaks for the association.

Today it is a single "coming soon" page in Spanish (`src/components/ComingSoon.astro`): the lotus emblem, a short line, her email and Instagram, the book with its Amazon links, and a link to the association. `src/pages/index.astro` and `src/pages/404.astro` both render it, so links to the old WordPress site's posts and pages (gone since 2026-11-13) reach the same content, with a 404 status. Its contact details and Amazon links, set in the frontmatter of `ComingSoon.astro`, are the same as the `.org`'s (`src/content/site.ts` and `src/content/book.ts` there): change both sites together. `../CLAUDE.md` lists everything the two share. It is indexable, unlike the `.org`, so that searches for her name find it now that the old site is gone. When the real site goes up, keep the old posts' addresses (`/<slug>/`).

It is live at https://turesiliencia.com since 2026-11-13 (Vercel project `turesiliencia-com` on her account, deployed on every push to `main`). The domain is registered at Vercel with Vercel's nameservers; `www` redirects to the bare domain (308), and https://deissy-olarte.vercel.app still serves the site too. The page's own address in its link-preview tags comes from `site` in `astro.config.mjs`, which takes Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time (the shortest production domain, now `turesiliencia.com`): after changing the project's domains, redeploy. Local builds fall back to `turesiliencia.com`.

Private context (the state of both sites, decisions, her material, the backup of the old site) is not in this repository. It lives one level up, in the folder that holds both sites and is in no repository: `../CLAUDE.md`, `../CLAUDE.local.md`, `../notes/` and `../refs/` (her old site's posts and pages as Markdown are in `../refs/com/`; how the site left WordPress is `../notes/com-migration.md`). Read `../CLAUDE.local.md` before writing content.

## Commands

```bash
npm run dev      # dev server on http://localhost:4321
npm run build    # static build into dist/
npm run preview  # serve the build
```

Astro 7 wants Node 22.23 or later; `.nvmrc` pins 24, as Vercel builds with: run `nvm use` first where the default Node is older. No test runner, no linter.

To look at the page without a browser, serve the build (`npx astro preview --port 3458`) and screenshot it with headless Chrome at a desktop and a phone width:

```bash
google-chrome --headless=new --hide-scrollbars --force-prefers-reduced-motion --virtual-time-budget=4000 \
  --window-size=390,1300 --screenshot=/path/outside/the/repo/mobile.png http://localhost:3458/
```

Stop the preview server afterwards (`npx astro preview stop`, or by its PID from `ss -ltnp | grep 3458`).

## How it is built

- Static Astro, no adapter: Vercel detects it and serves `dist/`.
- **Fonts and colours are the `.org`'s**: Cormorant Garamond and Montserrat through Astro's fonts API (`astro.config.mjs`, downloaded at build time and self-hosted), and the navy, gold and cream tokens in `src/styles/global.css`.
- **The lotus emblem** (`src/components/LogoEmblem.astro`) and **the Amazon icon** (`src/components/AmazonIcon.astro`, Simple Icons, CC0) are ported from the `.org`'s React components. The emblem uses fixed gradient ids, fine while it appears once per page.
- Styles that size a child component's SVG need `:global()`: Astro's scoped styles don't reach into another component's markup.
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
