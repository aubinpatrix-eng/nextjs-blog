import { LOCALE, TAG_SLUGS } from "./i18n";

export type Tag = {
  slug: string;
  label: string;
  description: string;
};

// Keep in sync with the "tag" select options in .pages.yml (French and English collections).
const FR_TAGS: Tag[] = [
  { slug: "force", label: "Force", description: "Squat, développé militaire, soulevé de terre : progresser sur ses PR et performer dans la Strength Zone de l'ATHX." },
  { slug: "endurance", label: "Endurance", description: "Course, rameur, circuits : construire un moteur capable de tenir 2h30 d'effort continu pendant l'ATHX." },
  { slug: "nutrition", label: "Nutrition", description: "Que manger avant, pendant et après l'ATHX, et comment exploiter la Refuel Zone." },
  { slug: "format", label: "Format", description: "Zones, catégories, règles : comprendre le format de l'ATHX pour mieux s'y préparer." },
  { slug: "mental", label: "Mental", description: "Gérer l'effort, les transitions et la pression le jour de la compétition ATHX." },
];

const EN_TAGS: Tag[] = [
  { slug: TAG_SLUGS.force, label: "Strength", description: "Back squat, overhead press, deadlift: build your PRs and perform in the ATHX Strength Zone." },
  { slug: TAG_SLUGS.endurance, label: "Endurance", description: "Running, rowing, circuits: build an engine that lasts 2.5 hours of continuous effort at ATHX." },
  { slug: TAG_SLUGS.nutrition, label: "Nutrition", description: "What to eat before, during and after ATHX, and how to make the most of the Refuel Zone." },
  { slug: TAG_SLUGS.format, label: "Format", description: "Zones, categories, rules: understand the ATHX format to prepare better." },
  { slug: TAG_SLUGS.mental, label: "Mindset", description: "Manage effort, transitions and pressure on ATHX competition day." },
];

export const TAGS: Tag[] = LOCALE === "en" ? EN_TAGS : FR_TAGS;

// A post's tag is its category label ("Force", "Strength"…) or slug, in either language.
export function getTag(labelOrSlug: string) {
  const key = labelOrSlug.toLowerCase();
  const index = [FR_TAGS, EN_TAGS]
    .map((tags) => tags.findIndex((tag) => tag.slug === key || tag.label.toLowerCase() === key))
    .find((i) => i >= 0);
  return index === undefined ? undefined : TAGS[index];
}
