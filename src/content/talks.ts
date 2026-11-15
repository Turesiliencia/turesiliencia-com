import { site } from "./site";

// Her lines of talks, for organisers: shown in full on /conferencias/ (each
// with its id as an anchor) and by title on the home page. The three lines
// and the complementary ones are hers; the descriptions draw on her own
// texts about the book.
export const talks = [
  {
    id: "reconstruccion-humana",
    title: "Reconstrucción Humana y dignidad",
    text: "Después de una pérdida, seguir funcionando no significa estar bien. Presento la diferencia entre sobrevivir y reconstruirse, y lo que una ruptura vital transforma en la persona: su identidad, su historia, sus recursos y su idea de futuro, y una dignidad que ninguna pérdida se lleva.",
    audience: "Congresos, universidades, fundaciones y administraciones",
    question: "¿Qué necesita una persona, más allá de resistir, para volver a reconocerse después de lo vivido?",
    takeaways: [
      "Una distinción clara entre sobrevivir y reconstruirse",
      "Un marco para comprender lo que cambia en la persona tras una ruptura vital",
      "Preguntas para acompañar sin reducir cada experiencia a una misma explicación",
    ],
  },
  {
    id: "duelo-migratorio",
    title: "Duelo migratorio e identidad profesional",
    text: "Migrar trae consigo un duelo múltiple: por el origen, las redes, el contexto cotidiano y el estatus que se reescribe. Abordo cómo ese duelo afecta a la identidad personal y profesional, y cómo integrarlo para reinventarse sin borrar lo que se fue.",
    audience: "Empresas, ONG, universidades y entidades que trabajan con personas migrantes",
    question: "¿Cómo se reconstruye una identidad profesional cuando el país, la lengua o el estatus ya no son los mismos?",
    takeaways: [
      "Las dimensiones del duelo migratorio, más allá de la nostalgia",
      "Claves para la reinvención profesional tras migrar",
      "Pautas para equipos y organizaciones que acogen a personas migrantes",
    ],
  },
  {
    id: "transiciones-vitales",
    title: "Transiciones vitales y reconstrucción del propósito",
    text: "Una enfermedad, una ruptura, un cambio que lo altera todo: hay etapas que nos obligan a preguntarnos quiénes somos y cuál es nuestro lugar. Propongo integrar el dolor en lugar de «superarlo», y decidir con libertad qué construir con lo que quedó en pie.",
    audience: "Empresas, centros educativos, comunidades y público general",
    question: "¿Qué hacer con lo que queda en pie después de un cambio que no tiene vuelta atrás?",
    takeaways: [
      "Por qué «ser fuerte» puede impedir la reconstrucción",
      "Herramientas para atravesar una transición sin invalidar ninguna etapa",
      "Un camino para volver a tener un propósito",
    ],
  },
];

// The formats she offers. The workshop topics are those of her old
// "Capacitaciones, seminarios y talleres".
export const formats = [
  { name: "Conferencia", text: "Una exposición para un congreso, una jornada o un acto institucional." },
  { name: "Diálogo", text: "Una conversación con una persona que modera o con el público." },
  { name: "Mesa redonda", text: "Mi participación junto a otras voces, sobre un tema común." },
  {
    name: "Taller y capacitación",
    text: "Una sesión práctica para grupos, centros educativos y empresas.",
    topics: [
      "Resiliencia migratoria y reinvención profesional",
      "Gestión de las emociones",
      "Elogio y corrección a los hijos",
      "Adolescencia",
      "Cómo afrontar crisis evolutivas y familiares",
      "El apego",
    ],
  },
];

// Lines that come from her path and from the association she founded.
export const complementary = ["Derechos humanos", "Mujeres migrantes", "Desarrollo rural"];

// "Solicitar propuesta": an email to her, its subject and body filled in.
const proposalBody = [
  "Hola, Deissy:",
  "",
  "Nos gustaría invitarte a nuestro evento.",
  "",
  "Evento:",
  "Fecha:",
  "Lugar (o en línea):",
  "Público:",
  "Formato (conferencia, diálogo, mesa redonda o taller):",
  "Tema o línea que nos interesa:",
  "",
  "Gracias.",
].join("\n");

export const proposalHref = `mailto:${site.email}?subject=${encodeURIComponent("Propuesta de conferencia")}&body=${encodeURIComponent(proposalBody)}`;
