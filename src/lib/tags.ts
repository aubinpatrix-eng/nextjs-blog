export type Tag = {
  slug: string;
  label: string;
  description: string;
};

// Keep in sync with the "tag" select options in .pages.yml.
export const TAGS: Tag[] = [
  { slug: "force", label: "Force", description: "Squat, développé militaire, soulevé de terre : progresser sur ses PR et performer dans la Strength Zone de l'ATHX." },
  { slug: "endurance", label: "Endurance", description: "Course, rameur, circuits : construire un moteur capable de tenir 2h30 d'effort continu pendant l'ATHX." },
  { slug: "nutrition", label: "Nutrition", description: "Que manger avant, pendant et après l'ATHX, et comment exploiter la Refuel Zone." },
  { slug: "format", label: "Format", description: "Zones, catégories, règles : comprendre le format de l'ATHX pour mieux s'y préparer." },
  { slug: "mental", label: "Mental", description: "Gérer l'effort, les transitions et la pression le jour de la compétition ATHX." },
];

export function getTag(labelOrSlug: string) {
  const key = labelOrSlug.toLowerCase();
  return TAGS.find((tag) => tag.slug === key || tag.label.toLowerCase() === key);
}
