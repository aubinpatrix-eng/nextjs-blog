import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

// City landing pages ("Préparation ATHX Paris"…), edited in Pages CMS.
export type AthxEvent = {
  slug: string;
  title: string;
  heading?: string;
  menuLabel: string;
  city: string;
  dates: string;
  startDate: string;
  venue: string;
  prepStart: string;
  kicker: string;
  excerpt: string;
  summary?: string;
  heroImage?: string;
  heroImageAlt?: string;
  ctaImage?: string;
  faq?: { question: string; answer: string }[];
  updated?: string;
  content: string;
};

const eventsDirectory = join(process.cwd(), "_events");

function toIso(value: unknown) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? "");
}

export function getEventBySlug(slug: string): AthxEvent | null {
  const fullPath = join(eventsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));
  return {
    ...(data as Omit<AthxEvent, "slug" | "content">),
    startDate: toIso(data.startDate),
    prepStart: toIso(data.prepStart),
    updated: data.updated ? toIso(data.updated) : undefined,
    slug,
    content,
  };
}

export function getAllEvents(): AthxEvent[] {
  if (!fs.existsSync(eventsDirectory)) return [];
  return fs
    .readdirSync(eventsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => getEventBySlug(file.replace(/\.md$/, "")) as AthxEvent)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
}
