// Site-wide constants. The email and the book's links are the same as on
// turesiliencia.org (src/content/site.ts and src/content/book.ts there): change
// both sites together. The Instagram is not: this is her personal account,
// the .org links the association's.
export const site = {
  name: "Deissy Olarte",
  // The home page's title and the default description. Search results cut a
  // description at about 155 characters: keep it under that.
  title: "Deissy Olarte · Teóloga, investigadora y conferencista",
  description:
    "Deissy Olarte, teóloga, investigadora y conferencista en Reconstrucción Humana, autora de «Sobrevivir no es reconstruirse» y fundadora de TuResiliencia.",
  email: "turesiliencia.com@gmail.com",
  instagram: {
    handle: "@deissyolarte_",
    url: "https://www.instagram.com/deissyolarte_",
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
  // The paperback's details, as Amazon lists them, for search engines.
  isbn: "9791399306217",
  pages: 228,
  published: "2026-10-30",
};

// Her sessions: what they cost and where they are paid. The prices are the
// ones her old site's Tarifas page showed (last updated November 2025).
export const sessions = {
  prices: [
    { name: "Sesión individual", price: "70 €" },
    { name: "Bono de 4 sesiones individuales", price: "250 €" },
    { name: "Sesión en pareja", price: "80 €" },
    { name: "Bono de 4 sesiones en pareja", price: "300 €" },
  ],
  paypalUrl: "https://paypal.me/turesilienciado",
};

// The pages and home-page sections linked from the header and the footer.
// Six don't fit a phone's header: there it leaves out those marked
// wideOnly, still in the footer and in the home page's own links.
export const nav = [
  { label: "Sobre mí", href: "/mihistoria/" },
  { label: "Conferencias", href: "/conferencias/" },
  { label: "Acompañamiento", href: "/servicios/" },
  { label: "Blog", href: "/miblog/" },
  { label: "Mi libro", href: "/#libro", wideOnly: true },
  { label: "Contacto", href: "/#contacto", wideOnly: true },
];
