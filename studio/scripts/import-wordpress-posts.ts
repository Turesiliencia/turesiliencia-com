// One-off import of the blog posts from the old WordPress site, already
// converted to Markdown (one folder per post: index.md with frontmatter, and
// its images). Run from studio/, logged in with `npx sanity login`:
//
//   POSTS_DIR=/path/to/posts DRY_RUN=1 npx sanity exec scripts/import-wordpress-posts.ts --with-user-token
//
// DRY_RUN=1 prints what it would write and uploads nothing. Without it, posts
// are written with fixed ids (post-<slug>), so running it again replaces them.
// Slugs listed in DRAFT_SLUGS are written as drafts, the others published.
import {createReadStream} from 'node:fs'
import {readdir, readFile, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {htmlToBlocks} from '@portabletext/block-tools'
import {Schema} from '@sanity/schema'
import {builtinTypes} from '@sanity/schema/_internal'
import matter from 'gray-matter'
import {JSDOM} from 'jsdom'
import {marked} from 'marked'
import {getCliClient} from 'sanity/cli'
import {schemaTypes} from '../schemaTypes'
import {youtubeId} from '../schemaTypes/youtube'

const DRAFT_SLUGS = new Set(
  (process.env.DRAFT_SLUGS ?? '').split(',').map((slug) => slug.trim()).filter(Boolean),
)
const postsDir = process.env.POSTS_DIR
const dryRun = process.env.DRY_RUN === '1'
if (!postsDir) throw new Error('Set POSTS_DIR to the folder holding one folder per post.')

const client = getCliClient({apiVersion: '2026-11-01'})
const schema = Schema.compile({name: 'default', types: [...builtinTypes, ...schemaTypes]})
const bodyType = schema
  .get('post')
  .fields.find((field: {name: string}) => field.name === 'body').type

async function uploadImage(file: string, filename: string): Promise<string> {
  if (dryRun) return `image-dry-run-${filename}`
  const asset = await client.assets.upload('image', createReadStream(file), {filename})
  return asset._id
}

const imageRef = (assetId: string) => ({_type: 'reference', _ref: assetId})

async function toBlocks(markdown: string, folder: string, slug: string, title: string) {
  const html = await marked.parse(markdown.replaceAll('​', ''))
  const document = new JSDOM(html).window.document

  // An image on a line of its own is a block of its own, not part of a paragraph.
  for (const p of document.querySelectorAll('p')) {
    const img = p.querySelector('img')
    if (img && p.children.length === 1 && !p.textContent?.trim()) p.replaceWith(img)
  }

  // Images are uploaded first: the conversion below is synchronous.
  const assets = new Map<string, string>()
  for (const img of document.querySelectorAll('img')) {
    const src = img.getAttribute('src') ?? ''
    if (!assets.has(src)) {
      assets.set(src, await uploadImage(path.join(folder, src), `${slug}-${path.basename(src)}`))
    }
  }

  return htmlToBlocks(document.body.innerHTML, bodyType, {
    parseHtml: (source) => new JSDOM(source).window.document,
    rules: [
      {
        deserialize(el, _next, block) {
          const tag = (el as Element).tagName?.toLowerCase()
          if (tag === 'img') {
            const img = el as HTMLImageElement
            const alt = img.getAttribute('alt')?.trim()
            return block({
              _type: 'image',
              asset: imageRef(assets.get(img.getAttribute('src') ?? '')!),
              ...(alt ? {alt} : {}),
            })
          }
          if (tag === 'iframe') {
            const id = youtubeId((el as Element).getAttribute('src') ?? '')
            if (!id) throw new Error(`${slug}: an iframe that is not YouTube`)
            return block({_type: 'youtube', url: `https://www.youtube.com/watch?v=${id}`, title})
          }
          return undefined
        },
      },
    ],
  })
}

const summary: string[] = []
const docs = []
for (const entry of (await readdir(postsDir, {withFileTypes: true})).filter((e) => e.isDirectory())) {
  const folder = path.join(postsDir, entry.name)
  const {data, content} = matter(await readFile(path.join(folder, 'index.md'), 'utf8'))
  const slug: string = data.slug
  const draft = DRAFT_SLUGS.has(slug)

  const body = await toBlocks(content, folder, slug, data.title)
  const cover = data.cover
    ? {
        _type: 'image',
        asset: imageRef(
          await uploadImage(path.join(folder, data.cover), `${slug}-${path.basename(data.cover)}`),
        ),
        ...(data.coverAlt?.trim() ? {alt: data.coverAlt.trim()} : {}),
      }
    : undefined

  const id = `post-${slug}`
  docs.push({
    _id: draft ? `drafts.${id}` : id,
    _type: 'post',
    title: data.title,
    slug: {_type: 'slug', current: slug},
    publishedAt: new Date(data.pubDate).toISOString(),
    ...(data.description ? {excerpt: data.description} : {}),
    ...(cover ? {coverImage: cover} : {}),
    body,
  })

  const types = body.map((b: {_type: string; style?: string; listItem?: string}) =>
    b._type === 'block' ? (b.listItem ? `li:${b.listItem}` : b.style) : b._type,
  )
  const counts = Object.entries(
    types.reduce((acc: Record<string, number>, t: string) => ({...acc, [t]: (acc[t] ?? 0) + 1}), {}),
  )
  summary.push(
    `${draft ? 'DRAFT    ' : 'PUBLISHED'} ${slug}  cover=${cover ? 'yes' : 'no'}  ${counts.map(([t, n]) => `${t}×${n}`).join(' ')}`,
  )
}

console.log(summary.sort().join('\n'))

if (dryRun) {
  const out = path.join(postsDir, '..', 'import-dry-run.json')
  await writeFile(out, JSON.stringify(docs, null, 2))
  console.log(`\nDry run: nothing written. Documents in ${out}`)
} else {
  const tx = client.transaction()
  for (const doc of docs) {
    tx.createOrReplace(doc)
    // A post is either published or a draft: drop the other copy left by an earlier run.
    tx.delete(doc._id.startsWith('drafts.') ? doc._id.slice('drafts.'.length) : `drafts.${doc._id}`)
  }
  await tx.commit()
  console.log(`\nWrote ${docs.length} posts.`)
}
