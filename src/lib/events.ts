import { entryAlternates, findBySlug, readCollection, toIso, type Entry } from "./content";
import { LOCALE, type Locale } from "./i18n";

// City landing pages ("Préparation ATHX Paris"…), edited in Pages CMS.
export type AthxEvent = {
  key: string;
  slug: string;
  title: string;
  seoTitle?: string;
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
  ctaImageAlt?: string;
  faq?: { question: string; answer: string }[];
  updated?: string;
  content: string;
};

function toEvent(entry: Entry): AthxEvent {
  const data = entry.data;
  return {
    ...(data as Omit<AthxEvent, "key" | "slug" | "content">),
    startDate: toIso(data.startDate) ?? "",
    prepStart: toIso(data.prepStart) ?? "",
    updated: toIso(data.updated),
    key: entry.key,
    slug: entry.slug,
    content: entry.content,
  };
}

export function getEventBySlug(slug: string, locale: Locale = LOCALE): AthxEvent | null {
  const entry = findBySlug("events", slug, locale);
  return entry ? toEvent(entry) : null;
}

export function getAllEvents(locale: Locale = LOCALE): AthxEvent[] {
  return readCollection("events", locale)
    .map(toEvent)
    .sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
}

export function eventAlternates(event: AthxEvent) {
  return entryAlternates("events", event.key, (entry) => `/${entry.slug}`);
}
