// Structured data (schema.org, as JSON-LD) shared by the pages: the site, who
// she is and her book. Search engines read it to tie the pages to her name.
// Each thing has one @id, so the pages describe the same person and book.
import { book, site } from "../content/site";

const at = (base: URL | undefined, path: string) => new URL(path, base).href;

export const personId = (base: URL | undefined) => at(base, "/#person");

export const website = (base: URL | undefined) => ({
  "@type": "WebSite",
  "@id": at(base, "/#website"),
  url: at(base, "/"),
  // The name search results show for the site.
  name: site.name,
  inLanguage: "es",
  publisher: { "@id": personId(base) },
});

export const person = (base: URL | undefined) => ({
  "@type": "Person",
  "@id": personId(base),
  name: site.name,
  url: at(base, "/"),
  jobTitle: "Teóloga, investigadora y conferencista",
  knowsAbout: ["Reconstrucción Humana", "Duelo migratorio", "Transiciones vitales", "Resiliencia"],
  email: `mailto:${site.email}`,
  // Only what Sobre mí already says.
  award: "Mujer Resiliente del Año 2025, Fundación Con Valores",
  alumniOf: { "@type": "CollegeOrUniversity", name: "Universidad de Valencia", url: "https://www.uv.es" },
  sameAs: [site.instagram.url],
  // The association is her own organisation, not another profile of hers. The
  // id is the one turesiliencia.org gives it, so both sites name one entity.
  affiliation: {
    "@type": "NGO",
    "@id": new URL("/#organization", site.association.url).href,
    name: site.association.name,
    url: site.association.url,
  },
});

// Who wrote a post: a reference to her, with her name for readers that don't
// follow references.
export const personRef = (base: URL | undefined) => ({
  "@type": "Person",
  "@id": personId(base),
  name: site.name,
  url: at(base, "/"),
});

export const bookData = (base: URL | undefined) => ({
  "@type": "Book",
  "@id": at(base, "/#libro"),
  name: book.title,
  author: { "@id": personId(base) },
  url: at(base, "/#libro"),
  isbn: book.isbn,
  bookFormat: "https://schema.org/Paperback",
  numberOfPages: book.pages,
  datePublished: book.published,
  inLanguage: "es",
  sameAs: [book.amazonUrl],
});
