export type Show = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  host: string;
  cover: string;
  category: string;
  frequency: string;
};

export type Episode = {
  id: string;
  showId: string;
  title: string;
  summary: string;
  description: string;
  cover: string;
  audio: string;
  publishedAt: string;
  durationSec: number;
  season: number;
  number: number;
  category: string;
  featured?: boolean;
};

export const SHOWS: Show[] = [
  {
    id: "despues",
    title: "Nervión & Heliópolis",
    tagline: "Dos colores. Una ciudad. Todo el fútbol.",
    description:
      "Podcast independiente sobre Sevilla y Betis. Antonio cubre los dos colores de una misma ciudad: jornada, derbi, banquillo y calle.",
    host: "Antonio",
    cover: "/covers/portada.jpg",
    category: "Fútbol",
    frequency: "Cada jornada",
  },
  {
    id: "nervion",
    title: "Nervión",
    tagline: "El barrio del este",
    description:
      "Avenida, naranjos, el estadio a un lado. Crónica de Nervión cuando ya no hay partido: escaparates, terrazas recogidas, el eco de la última salida.",
    host: "Antonio",
    cover: "/covers/show-nervion.jpg",
    category: "Barrio",
    frequency: "Quincenal",
  },
  {
    id: "heliopolis",
    title: "Heliópolis",
    tagline: "El barrio del sur",
    description:
      "Plazas bajas, el resplandor del campo al fondo. Heliópolis de noche: el kiosco cerrado, la torre a lo lejos, el barrio que se queda cuando se va la afición.",
    host: "Antonio",
    cover: "/covers/show-heliopolis.jpg",
    category: "Barrio",
    frequency: "Quincenal",
  },
  {
    id: "derbi",
    title: "Derbi",
    tagline: "Cuando la ciudad se parte",
    description:
      "El día del derbi y las horas de después. Dos cañas sin terminar, un papel de alineaciones, la ciudad otra vez en silencio.",
    host: "Antonio",
    cover: "/covers/show-derbi.jpg",
    category: "Derbi",
    frequency: "Cuando hay derbi",
  },
];

export const EPISODES: Episode[] = [
  {
    id: "ciudad",
    showId: "despues",
    title: "Lo que queda cuando se apaga el derbi",
    summary: "Dos colores. Una ciudad. Todo el fútbol, cuando ya no hay silbato.",
    description:
      "Antonio abre la temporada con Sevilla después del partido. Nervión y Heliópolis, Sevilla y Betis, la misma luz en dos barrios. Qué queda cuando se apagan los focos: el asfalto, el eco de una terraza, la costumbre de seguir hablando.",
    cover: "/covers/portada.jpg",
    audio: "/audio/nocturno.mp3",
    publishedAt: "2026-09-04T22:00:00+02:00",
    durationSec: 181,
    season: 2,
    number: 6,
    category: "Fútbol",
    featured: true,
  },
  {
    id: "cartas",
    showId: "despues",
    title: "Dos barrios, una misma luz",
    summary: "Tejados, antenas, el resplandor de un campo a lo lejos.",
    description:
      "Desde arriba Sevilla no elige bando. Un episodio sobre los tejados que miran a Nervión y a Heliópolis a la vez: la misma lámpara, el mismo río, dos himnos que se apagan a la misma hora.",
    cover: "/covers/ep-tejados.jpg",
    audio: "/audio/golondrinas.mp3",
    publishedAt: "2026-08-28T22:00:00+02:00",
    durationSec: 98,
    season: 2,
    number: 5,
    category: "Crónica",
  },
  {
    id: "dormir",
    showId: "despues",
    title: "Dormir es un país",
    summary: "Insomnio de jornada. Un vaso de agua, la ciudad colándose por la persiana.",
    description:
      "La noche posterior al partido. Antonio habla del insomnio como un territorio con aduana propia: el resultado que no se va, el barrio que no duerme, la radio todavía encendida.",
    cover: "/covers/ep-dormir.jpg",
    audio: "/audio/vivo.mp3",
    publishedAt: "2026-08-21T22:00:00+02:00",
    durationSec: 262,
    season: 2,
    number: 4,
    category: "Noche",
  },
  {
    id: "cine",
    showId: "despues",
    title: "El último cine de barrio",
    summary: "Butacas de terciopelo, polvo en el haz, una sala que ya no abre los lunes.",
    description:
      "Entre Nervión y Heliópolis todavía hay salas que se apagan de a poco. Un recorrido por el cine de barrio: la taquilla, el olor a moqueta, la costumbre de ir sin saber qué echan.",
    cover: "/covers/ep-cine.jpg",
    audio: "/audio/soneto.mp3",
    publishedAt: "2026-08-14T22:00:00+02:00",
    durationSec: 69,
    season: 2,
    number: 3,
    category: "Crónica",
  },
  {
    id: "mesa",
    showId: "despues",
    title: "Cómo se construye una mesa",
    summary: "Viruta, escuadra, una lámpara de taller. El oficio de hacer algo que dure.",
    description:
      "Fuera del césped también hay oficio. Antonio se queda en un taller de Heliópolis: la medida, la paciencia, lo que se corrige con la mano y no con la idea.",
    cover: "/covers/ep-mesa.jpg",
    audio: "/audio/ars.mp3",
    publishedAt: "2026-08-07T22:00:00+02:00",
    durationSec: 67,
    season: 2,
    number: 2,
    category: "Barrio",
  },
  {
    id: "fuego",
    showId: "despues",
    title: "Lo que se dice al apagar el fuego",
    summary: "El último tramo de la noche. Dos copas, una manta, nada que resolver.",
    description:
      "Cierre de tanda. El estudio ya en silencio, el derbi ya contado. Lo que se dice cuando ya no hace falta convencer a nadie — ni de Nervión ni de Heliópolis.",
    cover: "/covers/ep-fuego.jpg",
    audio: "/audio/repente.mp3",
    publishedAt: "2026-07-31T22:00:00+02:00",
    durationSec: 99,
    season: 2,
    number: 1,
    category: "Noche",
  },
  {
    id: "platero",
    showId: "nervion",
    title: "Naranjos de Nervión",
    summary: "La avenida de noche. Sillas apiladas, naranjos, el estadio a un lado.",
    description:
      "Paseo por Nervión cuando ya no hay partido. Los naranjos, las terrazas recogidas, el barrio que vuelve a ser barrio. Una crónica para oír andando despacio.",
    cover: "/covers/show-nervion.jpg",
    audio: "/audio/platero.mp3",
    publishedAt: "2026-09-02T21:00:00+02:00",
    durationSec: 119,
    season: 1,
    number: 8,
    category: "Barrio",
  },
  {
    id: "pasillo",
    showId: "nervion",
    title: "Voces en el pasillo",
    summary: "Una rendija de luz bajo la puerta. Bloques, vecinos, el resultado filtrado.",
    description:
      "Los portales de Nervión la noche del partido. Lo que se oye sin querer: un televisor, una discusión baja, alguien que vuelve tarde. El pasillo como archivo del barrio.",
    cover: "/covers/ep-pasillo.jpg",
    audio: "/audio/redondillas.mp3",
    publishedAt: "2026-08-19T21:00:00+02:00",
    durationSec: 232,
    season: 1,
    number: 7,
    category: "Crónica",
  },
  {
    id: "sesion",
    showId: "heliopolis",
    title: "Heliópolis a oscuras",
    summary: "El kiosco cerrado, la plaza vacía, el resplandor del campo al fondo.",
    description:
      "Heliópolis cuando se ha ido todo el mundo. La plaza, los naranjos, la torre a lo lejos. Un barrio que no necesita alboroto para ser el suyo.",
    cover: "/covers/show-heliopolis.jpg",
    audio: "/audio/nariz.mp3",
    publishedAt: "2026-08-30T23:00:00+02:00",
    durationSec: 86,
    season: 1,
    number: 4,
    category: "Barrio",
  },
  {
    id: "ati",
    showId: "heliopolis",
    title: "El río, de vuelta",
    summary: "El Guadalquivir de noche. Un puente, la orilla, la ciudad reflejada.",
    description:
      "Bajar desde Heliópolis hasta el río. Antonio graba el agua negra, las farolas, el puente. Una dedicación breve, sin destinatario en los créditos.",
    cover: "/covers/ep-rio.jpg",
    audio: "/audio/a_ti.mp3",
    publishedAt: "2026-08-16T23:00:00+02:00",
    durationSec: 46,
    season: 1,
    number: 3,
    category: "Noche",
  },
  {
    id: "belleza",
    showId: "derbi",
    title: "Dos cañas, mesa redonda",
    summary: "El día después. Dos sillas, dos cañas a medias, nada que discutir ya.",
    description:
      "La mesa de terraza que queda cuando se acaba el derbi. Antonio se sienta entre Nervión y Heliópolis y no elige. Lo que se bebe cuando ya no hay que ganar.",
    cover: "/covers/show-derbi.jpg",
    audio: "/audio/belleza.mp3",
    publishedAt: "2026-09-01T20:00:00+02:00",
    durationSec: 98,
    season: 1,
    number: 3,
    category: "Derbi",
  },
];

export const CATEGORIES = ["Fútbol", "Derbi", "Barrio", "Noche"] as const;

type Overlay = { shows: Show[]; episodes: Episode[] };

const SEED_SNAPSHOT: Overlay = { shows: SHOWS, episodes: EPISODES };
let overlay: Overlay | null = null;
const catalogListeners = new Set<() => void>();

export function setCatalogOverlay(next: Overlay | null) {
  overlay = next;
  catalogListeners.forEach((fn) => fn());
}

export function subscribeCatalog(listener: () => void) {
  catalogListeners.add(listener);
  return () => {
    catalogListeners.delete(listener);
  };
}

export function getCatalogSnapshot(): Overlay {
  return overlay ?? SEED_SNAPSHOT;
}

export function liveShows() {
  return getCatalogSnapshot().shows;
}

export function liveEpisodes() {
  return getCatalogSnapshot().episodes;
}

export function getShow(id: string) {
  return liveShows().find((s) => s.id === id);
}

export function getEpisode(id: string) {
  return liveEpisodes().find((e) => e.id === id);
}

export function episodesForShow(showId: string) {
  return liveEpisodes()
    .filter((e) => e.showId === showId)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function latestEpisodes(n = 8) {
  return [...liveEpisodes()]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, n);
}

export function featuredEpisode() {
  return liveEpisodes().find((e) => e.featured) ?? latestEpisodes(1)[0];
}

export function nextEpisode(id: string) {
  const current = getEpisode(id);
  if (!current) return undefined;
  const list = episodesForShow(current.showId);
  const idx = list.findIndex((e) => e.id === id);
  if (idx < 0) return undefined;
  return list[idx + 1];
}

export function searchEpisodes(q: string) {
  const n = q.trim().toLowerCase();
  if (!n) return latestEpisodes(12);
  return liveEpisodes()
    .filter((e) => {
      const show = getShow(e.showId);
      const hay = `${e.title} ${e.summary} ${e.description} ${show?.title ?? ""} ${e.category}`.toLowerCase();
      return hay.includes(n);
    })
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function episodeCode(ep: Episode) {
  return `T${String(ep.season).padStart(2, "0")} · E${String(ep.number).padStart(2, "0")}`;
}

