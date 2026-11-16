// The blog posts live in Sanity (project qnm95gjz, dataset production; the
// Studio is in studio/). They are read at build time only: the site stays
// static, and publishing in the Studio triggers a new deployment.
import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { toPlainText } from "@portabletext/toolkit";
import type { PortableTextBlock } from "@portabletext/types";

const client = createClient({
  projectId: "qnm95gjz",
  dataset: "production",
  apiVersion: "2026-11-01",
  // Straight from the API: a build right after publishing must see the post.
  useCdn: false,
  perspective: "published",
});

const builder = createImageUrlBuilder({ projectId: "qnm95gjz", dataset: "production" });

export const urlFor = (source: SanityImageSource) => builder.image(source).auto("format");

// The link preview: a fixed 1200×630 JPEG, which every app can read.
export const socialImageUrl = (source: SanityImageSource) =>
  builder.image(source).width(1200).height(630).fit("crop").format("jpg").url();

export interface SanityImage {
  _type: "image";
  asset: {
    _id: string;
    metadata?: { dimensions?: { width: number; height: number }; lqip?: string };
  };
  hotspot?: unknown;
  crop?: unknown;
  alt?: string;
  caption?: string;
}

export interface PostSummary {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  coverImage?: SanityImage;
}

export interface Post extends PostSummary {
  // Only the hand-written excerpt: `excerpt` falls back to the first words.
  description?: string;
  body: PortableTextBlock[];
  updatedAt: string;
}

const imageFields = `{..., asset->{_id, metadata{dimensions, lqip}}}`;

const summaryFields = `
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  coverImage${imageFields},
  "body": body[_type == "block" && style == "normal" && !defined(listItem)][0...4]
`;

interface RawSummary extends Omit<PostSummary, "excerpt"> {
  excerpt?: string;
  body?: PortableTextBlock[];
}

// The hand-written summary, or else the first words of the text, cut at a word.
function summarise({ excerpt, body, ...post }: RawSummary): PostSummary {
  if (excerpt?.trim()) return { ...post, excerpt: excerpt.trim() };
  const text = toPlainText(body ?? []).replace(/\s+/g, " ").trim();
  const cut = text.length > 180 ? `${text.slice(0, 180).replace(/\s+\S*$/, "")}…` : text;
  return { ...post, excerpt: cut };
}

const validPost = `_type == "post" && defined(slug.current) && defined(publishedAt)`;

export async function getPosts(): Promise<PostSummary[]> {
  const posts = await client.fetch<RawSummary[]>(
    `*[${validPost}] | order(publishedAt desc) {${summaryFields}}`,
  );
  return posts.map(summarise);
}

// When each post last changed, by slug: the sitemap's lastmod.
export async function getPostDates(): Promise<Map<string, string>> {
  const posts = await client.fetch<{ slug: string; updatedAt: string }[]>(
    `*[${validPost}] {"slug": slug.current, "updatedAt": _updatedAt}`,
  );
  return new Map(posts.map((p) => [p.slug, p.updatedAt]));
}

export async function getPost(slug: string): Promise<Post | null> {
  const post = await client.fetch<(RawSummary & Omit<Post, "excerpt">) | null>(
    `*[${validPost} && slug.current == $slug][0] {
      ${summaryFields},
      "description": excerpt,
      "updatedAt": _updatedAt,
      "fullBody": body[]{
        ...,
        _type == "image" => ${imageFields}
      }
    }`,
    { slug },
  );
  if (!post) return null;
  const { fullBody, ...rest } = post as typeof post & { fullBody: PortableTextBlock[] };
  return { ...summarise(rest), description: post.description, updatedAt: post.updatedAt, body: fullBody ?? [] };
}

// A responsive image: srcset over a few widths, optionally cropped to a ratio
// (the crop follows the hotspot set in the Studio).
export function imageAttrs(
  image: SanityImage,
  { widths, ratio }: { widths: number[]; ratio?: number },
) {
  const dims = image.asset.metadata?.dimensions;
  const naturalRatio = dims ? dims.height / dims.width : 2 / 3;
  const h = ratio ?? naturalRatio;
  const src = (w: number) => {
    const url = urlFor(image).width(w);
    return (ratio ? url.height(Math.round(w * ratio)).fit("crop") : url.fit("max")).url();
  };
  const largest = widths[widths.length - 1];
  return {
    src: src(largest),
    srcset: widths.map((w) => `${src(w)} ${w}w`).join(", "),
    width: largest,
    height: Math.round(largest * h),
    alt: image.alt ?? "",
  };
}

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeZone: "Europe/Madrid",
});

export const formatDate = (iso: string) => dateFormat.format(new Date(iso));
