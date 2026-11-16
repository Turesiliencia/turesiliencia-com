# CLAUDE.md

@AGENTS.md

## Project state

Deissy Olarte's personal site, at https://turesiliencia.com. The association TuResiliencia has its own site at https://www.turesiliencia.org, in the sibling repository `../turesiliencia-org` (`Turesiliencia/web`): keep the two apart. This one is in her first-person voice; the `.org` speaks for the association.

It is a static Astro site in Spanish. Its pages:

| Address          | File                           | What it is                                                                                                   |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `/`              | `src/pages/index.astro`        | Home: hero, her talks, about her, the book, the three latest posts, her individual support, contact          |
| `/conferencias/` | `src/pages/conferencias.astro` | For organisers: her three lines of talks, the formats (workshops included), "Solicitar propuesta" (`#propuesta`) |
| `/mihistoria/`   | `src/pages/mihistoria.astro`   | "Sobre mí" in the menu: her path (education, experience, award, publications, videos), then her story      |
| `/servicios/`    | `src/pages/servicios.astro`    | "Acompañamiento" in the menu: the five areas of her individual support, sessions, prices (`#tarifas`), booking |
| `/miblog/`       | `src/pages/miblog/`            | Every published post, newest first                                                                           |
| `/<slug>/`       | `src/pages/[slug].astro`       | A post, then three more and the book                                                                         |
| anything else    | `src/pages/404.astro`          | Not found, with links home and to the blog                                                                   |

The site presents her first as a theologian, researcher and speaker on Reconstrucción Humana, hireable by organisers, then her work, her lived experience and the association; individual support comes after. Mi historia's story and Servicios are her own wording, corrected and in the first person; the hero, the talks and the intros of Sobre mí and Conferencias are drafts in her voice, for her to correct. `/temarios/`, `/tarifas/` and `/tuvideoconferencia/` redirect to `/servicios/` (`vercel.json`, with and without the slash): links to them are already shared, so keep the redirects, and keep every post's address. The five areas of her support are `areas` in `src/content/services.ts`; the talks, their formats (her workshops among them) and the "Solicitar propuesta" `mailto:` link (subject and body filled in; the site collects nothing) are in `src/content/talks.ts`. The blog posts come from Sanity (below); everything else is in the code. The session prices and the PayPal link are `sessions` in `src/content/site.ts`. Her email and the book's Amazon links are in the same file, the same as the `.org`'s (`src/content/site.ts` and `src/content/book.ts` there): change both sites together. Her Instagram there is her personal account, not the association's that the `.org` links. `../CLAUDE.md` lists everything the two share. It is indexable, unlike the `.org`, with a sitemap (`@astrojs/sitemap`) and `public/robots.txt`.

It is live at https://turesiliencia.com since 2026-11-13 (Vercel project `turesiliencia-com` on her account, deployed on every push to `main`). The domain is registered at Vercel with Vercel's nameservers; `www` redirects to the bare domain (308), and https://deissy-olarte.vercel.app still serves the site too. The site's own address (canonical links, link-preview tags, sitemap) comes from `site` in `astro.config.mjs`, which takes Vercel's `VERCEL_PROJECT_PRODUCTION_URL` at build time (the shortest production domain, now `turesiliencia.com`): after changing the project's domains, redeploy. Local builds fall back to `turesiliencia.com`.

Private context (the state of both sites, decisions) is not in this repository. Her publishable material (logos, the book's cover, back cover, texts and QR codes) is in `material/`, the same files as in the `.org`'s, which `.gitignore` excludes: it stays on Kevin's machine, and a file from it goes public only once prepared and copied into the site; the rest lives one level up, in the folder that holds both sites and is in no repository: `../CLAUDE.md`. Read it before writing content.

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
- **Layout**: `src/layouts/BaseLayout.astro` (head, link-preview tags, JSON-LD, header, footer). Header and footer (`SiteHeader`, `SiteFooter`) are ported from the `.org`'s; their links are `nav` in `src/content/site.ts`, where `wideOnly` keeps a link out of the header on a phone (six don't fit).
- **Fonts, colours and themes are hers, not the `.org`'s** (since 2026-11-15): Fraunces for display and Montserrat for text (the logo's typeface, shared with the `.org`, whose display face is Cormorant Garamond), through Astro's fonts API (`astro.config.mjs`, downloaded at build time and self-hosted). The colours are in `src/styles/theme.css`, this site's own (it was a copy of the `.org`'s until 2026-11-15). Its palette comes from the book's cover, where the `.org`'s comes from the logo's blue: forest green, terracotta, the cover's gold for small details, cream. Styles use the roles (`--paper`, `--ink`, `--ink-soft`, `--accent`, `--detail`, `--rule`, `--glow`, `--button-*`…), each with a light and a dark value; only the video frame and the text selection use the palette directly. Light is the default: ivory paper `#f5f1e8`, deep green ink `#1d2a22`, terracotta `#9a4428` for labels and links (5.8:1), green buttons. Dark is the cover's deep green `#111b15`, cream, and apricot `#e3a07a` for accents and buttons. Dark applies when the visitor picks it, when their system is dark and they haven't picked, and inside any `.dark` band: the book section and the footer.
- **Choosing the theme**: an inline script at the top of `BaseLayout.astro`'s head sets `data-theme` on `<html>` before anything is drawn (the saved choice in `localStorage.theme`, else the system's, followed live until the visitor picks). `src/components/ThemeToggle.astro`, in the header, is a toggle button ("Tema oscuro", `aria-pressed` in dark) that switches and saves it; `theme.css` hides it until the script has run. Without JavaScript the system's theme still applies, through the media query. `theme-color` has one value per system theme.
- **What sets this site apart from the `.org`**, at first glance: this one is a person's and looks personal, the `.org` speaks for a collective and looks institutional. Keep each on its side:
  - **Voice**: her first person, speaking to "tú"; the `.org` says "we" and addresses institutions.
  - **Opening** (reworked 2026-11-15, Kevin: "push the difference further", copy kept): warm paper, "Hola, soy" (an italic label after a short rule) over her name set large on two lines, "Deissy" in ink and "Olarte" in terracotta italic, set in; then her title, the two lines on her work and the buttons, all left-aligned. Beside them (below them on a phone) her book, decoration only (`aria-hidden`, since the text names it and its section follows), standing on the page as a paperback in CSS 3D (`.book3d` in `index.astro`: the cover turned 30°, its fore edge of pages, the back behind, a soft shadow on the paper; no animation). At its foot a black store badge, "Disponible en Amazon" with the Amazon mark, linking to the paperback (`book.amazonUrl`); it fades in once (not with reduced motion; Kevin: "sober and doesn't distract"). Kevin's path to it, 2026-11-15: an arch with a sun, an offset outline and a turning seal ("less art", "more focus on the book itself"), then the cover alone in the arch with a "Nuevo libro" pill, then "find something else for the arch" and a badge that "fits better a Kindle or Amazon book". Not her photo there (Kevin, 2026-11-14). Until 2026-11-15 the hero had fine rings like ripples instead. The `.org` opens on a navy header and a navy hero, its lotus medallion centred over gold capitals.
  - **Structure**: no hairlines between sections (`.section` has none) and no numbers; some sections sit in a `.panel` (global: set in from the page's edges, rounded, on `--paper-deep`): the talks and the support on the home page, the formats on Conferencias, the book (in green, since it is `dark`), the rates on Servicios, the facets on Mi historia, "Sigue leyendo" under a post. The footer is rounded at the top. "Sobre mí" ends with her name as a signature (`.signature`, tilted). The `.org` runs full-width sections between rules, numbered like a report, navy at both ends.
  - **Type and shapes**: `.label` is the serif's italic in sentence case (the `.org`'s labels are spaced capitals), the header and footer links and dates are in sentence case, titles in mixed case (the `.org`'s in capitals); buttons are pills (`border-radius: 2rem`), and the cards (the pillars of "Sobre mí", soft on `--paper-deep`), post covers, the portrait and the videos have rounded corners (the `.org` keeps everything square).
  - **Colour, type and mark** (2026-11-15, so that a visitor coming from the `.org` feels they are somewhere else): the book's green and terracotta against the `.org`'s navy and blue; Fraunces titles against its Cormorant capitals; her "DO" monogram (`src/components/Monogram.astro`, in the button colours) beside her name in the header and footer, and as the favicon and touch icon, where the `.org` shows the lotus; a green footer where its footer is navy.
  - **Shared, for the family**: Montserrat for text, gold as a detail, the lotus (here only beside the association's name in the footer, and on a post card without a cover), the theme button and its behaviour.

  On the home page the talks and the areas of her support are numbered lists linking to `/conferencias/#<id>` and `/servicios/#<id>`; the book sits in a green band. `global.css` holds the classes the pages share (`.section`, `.label`, `.title`, `.body-text`, `.button-primary`, `.button-secondary`, `.arrow-link`).
- **The lotus emblem** (`src/components/LogoEmblem.astro`; its white underlay makes it look right on paper as on a dark ground), the association's mark, appears only beside the association's link in the footer and on a post card without a cover. It and **the Amazon icon** (`src/components/AmazonIcon.astro`, Simple Icons, CC0) are ported from the `.org`'s React components. The emblem appears several times on a page, so each copy takes an `id` prop for its gradient ids.
- **Links to the association** (`site.association` in `src/content/site.ts`): in "Sobre mí" on the home page (with one clause on what it does, so that institutions know to go there), the intro and the signature on Mi historia, the complementary lines on Conferencias, and the footer's "La asociación" column. She is its "fundadora y presidenta"; the association backs her path without competing with her name. In the JSON-LD the association is her `affiliation`, not a `sameAs` (which would claim it is another profile of hers). Its areas and statutes are described on the `.org` only.
- **The book** (`src/components/BookSection.astro`) is on the home page and under every post.
- Styles that size a child component's SVG or image need `:global()`: Astro's scoped styles don't reach into another component's markup. The same goes for the post body, which is HTML from `set:html`.
- The book cover (`src/assets/`) and link preview (`public/social-card-book.png`) are copies of the `.org`'s files, metadata already stripped. The favicon (`public/favicon.svg`, a green disc) and touch icon (`public/apple-touch-icon.png`, 180×180, a green square) are her monogram, its letters outlined from Fraunces italic (weight 600 in the favicon, 500 in the touch icon) by a throwaway script that is not in the repository: redo them the same way if the monogram changes.

## Git and what can be committed

The repository `Turesiliencia/turesiliencia-com` is on Deissy's GitHub account and **public**: everything committed can be read by anyone, permanently. It is public because on Vercel's Hobby plan a private repository blocks deployments of commits not authored by the account owner. Commits are authored by `kevjrmy`; never author them as her.

One branch, `main`: every push to it is a production deployment, and a mistake is undone with another push. Run `npm run build` first where the machine allows it; otherwise check the deployment after the push. Kevin reviews before anything is published and says when to push.

The bar for anything committed: if Deissy has not already published it, it does not go in. Never commit `.env*`, nor anything copied from the private context (`../CLAUDE.md`), except what she has published or asked to publish (`../CLAUDE.md` says which). `.env*` and `refs/` are gitignored: never force-add them. Images: cleared for publication, metadata stripped.

Before each commit, look at `git status`, add files by name, then:

```bash
git diff --cached --name-only | grep -Ei '^refs/|CLAUDE\.local|\.env|\.(pem|key|pdf|docx?|csv|xlsx?|ods)$'
git diff --cached | grep -Ei 'token|secret|password|api[_-]?key|BEGIN .*PRIVATE'
```

If either prints anything, stop and look. The second also matches this file's own words ("token", "secret"…) when the lines holding them change: such hits are expected.
