// A post's text, from Portable Text to HTML. Text is escaped by toHTML; only
// the custom blocks below build markup by hand, and they escape what they use.
import { escapeHTML, toHTML, uriLooksSafe } from "@portabletext/to-html";
import type { PortableTextBlock } from "@portabletext/types";
import { imageAttrs, type SanityImage } from "./sanity";

function youtubeId(url: string): string | undefined {
  return url.match(
    /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/,
  )?.[1];
}

export function renderBody(body: PortableTextBlock[]): string {
  return toHTML(body, {
    components: {
      types: {
        image: ({ value }: { value: SanityImage }) => {
          if (!value?.asset?._id) return "";
          const img = imageAttrs(value, { widths: [480, 768, 1080, 1440] });
          const caption = value.caption
            ? `<figcaption>${escapeHTML(value.caption)}</figcaption>`
            : "";
          return `<figure class="pt-image"><img src="${img.src}" srcset="${img.srcset}" sizes="(min-width: 48rem) 44rem, 100vw" width="${img.width}" height="${img.height}" alt="${escapeHTML(img.alt)}" loading="lazy" decoding="async">${caption}</figure>`;
        },
        youtube: ({ value }: { value: { url?: string; title?: string } }) => {
          const id = value?.url && youtubeId(value.url);
          if (!id) return "";
          const title = escapeHTML(value.title || "Vídeo de YouTube");
          return `<div class="pt-video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${title}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
        },
      },
      marks: {
        link: ({ children, value }) => {
          const href: string = value?.href ?? "";
          if (!uriLooksSafe(href)) return children;
          const external = /^https?:\/\//.test(href) && !href.startsWith("https://turesiliencia.com");
          return `<a href="${escapeHTML(href)}"${external ? ' rel="noopener"' : ""}>${children}</a>`;
        },
      },
    },
  });
}
