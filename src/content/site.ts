// Site-wide constants. The contact details and the book's links are the same
// as on turesiliencia.org (src/content/site.ts and src/content/book.ts there):
// change both sites together.
export const site = {
  name: "Deissy Olarte",
  title: "Deissy Olarte · TuResiliencia",
  description:
    "Deissy Olarte, especialista en duelo migratorio y transiciones vitales, autora de «Sobrevivir no es reconstruirse» y fundadora de TuResiliencia. Su blog, su libro y cómo contactarla.",
  email: "turesiliencia.com@gmail.com",
  instagram: {
    handle: "@turesiliencia_",
    url: "https://www.instagram.com/turesiliencia_",
  },
  association: {
    name: "Asociación TuResiliencia",
    url: "https://www.turesiliencia.org",
  },
};

export const book = {
  title: "Sobrevivir no es reconstruirse",
  author: "Deissy Olarte",
  // The paperback. amazon.com is for readers in Latin America, who have no
  // Amazon store of their own.
  amazonUrl: "https://www.amazon.es/dp/B0HQ1SSMKB",
  otherStoreUrl: "https://www.amazon.com/dp/B0HQ1SSMKB",
};

// The sections of the home page, linked from the header and the footer.
export const nav = [
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Blog", href: "/miblog/" },
  { label: "Mi libro", href: "/#libro" },
  { label: "Contacto", href: "/#contacto" },
];
