# CLAUDE.md

@AGENTS.md

## Project state

Deissy Olarte's personal site, at https://turesiliencia.com. The association TuResiliencia has its own site at https://www.turesiliencia.org, in the sibling repository `../turesiliencia-org` (`Turesiliencia/web`): keep the two apart. This one is in her first-person voice; the `.org` speaks for the association.

It is a static Astro site in Spanish. Its pages:

| Address        | File                         | What it is                                                                       |
| -------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `/`            | `src/pages/index.astro`      | Home: hero, about her, her six areas, the three latest posts, the book, contact  |
| `/mihistoria/` | `src/pages/mihistoria.astro` | Her story, education, the 2025 award (video in `public/video/`) and an interview |
| `/servicios/`  | `src/pages/servicios.astro`  | The six areas she works in, online sessions, prices (`#tarifas`), how to book    |
| `/miblog/`     | `src/pages/miblog/`          | Every published post, newest first                                               |
| `/<slug>/`     | `src/pages/[slug].astro`     | A post, then three more and the book                                             |
| anything else  | `src/pages/404.astro`        | Not found, with links home and to the blog                                       |

Mi historia and Servicios are her own wording, corrected and in the first person. `/temarios/`, `/tarifas/` and `/tuvideoconferencia/` redirect to `/servicios/` (`vercel.json`, with and without the slash): links to them are already shared, so keep the redirects, and keep every post's address. The six areas are `areas` in `src/content/services.ts`. The blog posts come from Sanity (below); everything else is in the code. The session prices and the PayPal link are `sessions` in `src/content/site.ts`. Her contact details and the book's Amazon links are in the same file, the same as the `.org`'s (`src/content/site.ts` and `src/content/book.ts` there): change both sites together. `../CLAUDE.md` lists everything the two share. It is indexable, unlike the `.org`, with a sitemap (`@astrojs/sitemap`) and `public/robots.txt`.

It is live at https://turesiliencia.com since 2026-11-13 (Vercel project `turesiliencia-com` on her account, deployed on every push to `main`). The domain is registered at Vercel with Vercel's nameservers; `www` redirects to the bare domain (308), and https://deissy-olarte.vercel.app still serves the site too. The site's own address (canonical links, link-preview tags, sitemap) comes from `site` in `astro.config.mjs`, which takes Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time (the shortest production domain, now `turesiliencia.com`): after changing the project's domains, redeploy. Local builds fall back to `turesiliencia.com`.

Private context (the state of both sites, decisions, her material) is not in this repository. Her material is in `refs/` in this folder, which `.gitignore` excludes; the rest lives one level up, in the folder that holds both sites and is in no repository: `../CLAUDE.md`. Read it before writing content.

## Commands

```bash
npm run dev      # dev server on http://localhost:4321
npm run build    # static build into dist/ (fetches the posts from Sanity)
npm run preview  # serve the build
```

Node 26: `engines.node` in `package.json` is `26.x`, which is also what Vercel builds with (it overrides the project's setting), and `.nvmrc` pins the same for `nvm use`. No test runner, no linter.

To look at a page without a browser, serve the build (`npx astro preview --port 3458`) and screenshot it with headless Chrome at a desktop and a phone width. Pages are longer than a screen: use a tall window (about 4300 px at 1440 wide, 7600 px at 390 for the home page):

```bash
google-chrome --headless=new --hide-scrollbars --force-prefers-reduced-motion --virtual-time-budget=6000 \
  --window-size=390,7600 --screenshot=/path/outside/the/repo/mobile.png http://localhost:3458/
```

Stop the preview server afterwards (`npx astro preview stop`, or by its PID from `ss -ltnp | grep 3458`).

## The posts, in Sanity

- **Where**: Sanity project `qnm95gjz`, dataset `production` (public: anyone can read published documents; drafts need a login), owned by her Sanity account (the "Turesiliencia" GitHub login). Free plan.
- **The Studio** is in `studio/`, a separate npm package that neither Astro nor Vercel builds: `cd studio && npm install && npm run dev` (http://localhost:3333), `npm run deploy` to publish the hosted Studio. Its schema (`studio/schemaTypes/`) has one document type, `post` (title, slug, date, excerpt, cover image with alt text, body), and a `youtube` block for the body. Its labels are in Spanish, for her.
- **The site reads Sanity at build time only** (`src/lib/sanity.ts`, published perspective, no CDN so a build right after publishing sees the post), so the site stays fully static. A new or changed post goes live with the next deployment: a Sanity webhook calls a Vercel deploy hook, which starts one on every publish of a post.
- **The body** is Portable Text, turned into HTML by `src/lib/portable-text.ts` (`@portabletext/to-html`, which escapes the text; the image and YouTube blocks escape what they use). Its styles are under `.prose` in `src/pages/[slug].astro`.
- **Images** are served from Sanity's CDN in several widths (`imageAttrs` in `src/lib/sanity.ts`); cards crop to 3:2 following the hotspot set in the Studio. A post's link preview is its cover cropped to 1200×630 JPEG; pages without one use `public/social-card-book.png`.
- **Excerpts**: the post's own, or else its first paragraphs cut at about 180 characters.

## How it is built

- Static Astro, no adapter: Vercel detects it and serves `dist/`. `trailingSlash: "always"` in Astro and `vercel.json` keeps the posts' addresses (`/<slug>/`); Vercel redirects the address without the slash.
- **Layout**: `src/layouts/BaseLayout.astro` (head, link-preview tags, JSON-LD, header, footer). Header and footer (`SiteHeader`, `SiteFooter`) are ported from the `.org`'s; their links are `nav` in `src/content/site.ts`.
- **Fonts, colours and themes are the `.org`'s**: Cormorant Garamond and Montserrat through Astro's fonts API (`astro.config.mjs`, downloaded at build time and self-hosted). The colours are in `src/styles/theme.css`, **the same file as the `.org`'s `src/app/theme.css`: change both together**. It holds the palette (navy and blues from the logo, gold and cream from the book cover) and the roles styles use instead of it (`--paper`, `--ink`, `--ink-soft`, `--accent`, `--rule`, `--band`, `--glow`, `--button-*`…; the lotus and the video frame are the only direct palette uses), each with a light and a dark value. Light is the default: warm paper `#f4f0e6`, soft navy ink `#1a2844`, a deeper gold `#765c27` (5.5:1); the `.org` lays a cool white and blue light theme of its own over this file, in its `globals.css`, and keeps this one's dark theme. Dark is the `.org`'s navy, cream and gold. Dark applies when the visitor picks it, when their system is dark and they haven't picked, and inside any `.dark` band: the footer on both sites, and here the book section too.
- **Choosing the theme**: an inline script at the top of `BaseLayout.astro`'s head sets `data-theme` on `<html>` before anything is drawn (the saved choice in `localStorage.theme`, else the system's, followed live until the visitor picks). `src/components/ThemeToggle.astro`, in the header, is a toggle button ("Tema oscuro", `aria-pressed` in dark) that switches and saves it; `theme.css` hides it until the script has run. Without JavaScript the system's theme still applies, through the media query. `theme-color` has one value per system theme.
- **What sets this site apart from the `.org`**, at first glance: this one is a person's and looks personal, the `.org` speaks for a collective and looks institutional. Keep each on its side:
  - **Voice**: her first person, speaking to "tú"; the `.org` says "we" and addresses institutions.
  - **Opening**: warm paper, "Hola, soy" (an italic label after a short rule) over her name in ink, in mixed case, left-aligned over a quiet background pattern (fine rings spreading like ripples, off to the right; CSS only, in `index.astro`, drawn in `--rule-strong` so it follows both themes, and masked three times: a radial fade, a second one, `--clear`, that keeps them from behind the text, set from the top right corner on a phone, and `--foot`, that fades them out before the hero's foot, since no rule closes it). No image and not her photo there (Kevin, 2026-11-14). The `.org` opens on a navy header and a navy hero, its lotus medallion centred over gold capitals.
  - **Structure**: no hairlines between sections (`.section` has none) and no numbers; some sections sit in a `.panel` (global: set in from the page's edges, rounded, on `--paper-deep`): the services on the home page, the book (in navy, since it is `dark`), the rates on Servicios, the facets on Mi historia, "Sigue leyendo" under a post. The footer is rounded at the top. "Sobre mí" ends with her name as a signature (`.signature`, tilted). The `.org` runs full-width sections between rules, numbered like a report, navy at both ends.
  - **Type and shapes**: `.label` is the serif's italic in sentence case (the `.org`'s labels are spaced capitals), the header and footer links and dates are in sentence case, titles in mixed case (the `.org`'s in capitals); buttons are pills (`border-radius: 2rem`), and the cards (the pillars of "Sobre mí", soft on `--paper-deep`), post covers, the portrait and the videos have rounded corners (the `.org` keeps everything square).
  - **Shared, for the family**: the fonts, the palette and its dark theme, the lotus, the navy footer, the theme button.

  The six areas are a numbered list linking to `/servicios/#<id>` (`src/content/services.ts`, shared with that page); the book sits in a navy band. `global.css` holds the classes the pages share (`.section`, `.label`, `.title`, `.body-text`, `.button-primary`, `.button-secondary`, `.arrow-link`).
- **The lotus emblem** (`src/components/LogoEmblem.astro`; its white underlay makes it look right on paper as on navy) and **the Amazon icon** (`src/components/AmazonIcon.astro`, Simple Icons, CC0) are ported from the `.org`'s React components. The emblem appears several times on a page, so each copy takes an `id` prop for its gradient ids.
- **Links to the association** (`site.association` in `src/content/site.ts`): in "Sobre mí" on the home page (with one clause on what it does, so that institutions know to go there), the footer's "La asociación" column, and the signature on Mi historia. In the JSON-LD the association is her `affiliation`, not a `sameAs` (which would claim it is another profile of hers). Its areas and statutes are described on the `.org` only.
- **The book** (`src/components/BookSection.astro`) is on the home page and under every post.
- Styles that size a child component's SVG or image need `:global()`: Astro's scoped styles don't reach into another component's markup. The same goes for the post body, which is HTML from `set:html`.
- The book cover (`src/assets/`), favicon, touch icon and link preview (`public/social-card-book.png`) are copies of the `.org`'s files, metadata already stripped.

## Git and what can be committed

The repository `Turesiliencia/turesiliencia-com` is on Deissy's GitHub account and **public**: everything committed can be read by anyone, permanently. It is public because on Vercel's Hobby plan a private repository blocks deployments of commits not authored by the account owner. Commits are authored by `kevjrmy`; never author them as her.

Every push to `main` is a production deployment: run `npm run build` first. Kevin reviews before anything is published and says when to push.

The bar for anything committed: if Deissy has not already published it, it does not go in. Never commit `.env*`, nor anything copied from the private material (`refs/` here, `../CLAUDE.md`), except what she has published or asked to publish (`../CLAUDE.md` says which). `.env*` and `refs/` are gitignored: never force-add them. Images: cleared for publication, metadata stripped.

Before each commit, look at `git status`, add files by name, then:

```bash
git diff --cached --name-only | grep -Ei '^refs/|CLAUDE\.local|\.env|\.(pem|key|pdf|docx?|csv|xlsx?|ods)$'
git diff --cached | grep -Ei 'token|secret|password|api[_-]?key|BEGIN .*PRIVATE'
```

If either prints anything, stop and look. The second also matches this file's own words ("token", "secret"…) when the lines holding them change: such hits are expected.
