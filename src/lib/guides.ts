import { entryAlternates, findBySlug, readCollection, toIso, type Entry } from "./content";
import { LOCALE, type Locale } from "./i18n";

// Evergreen guide pages (workouts, categories, movements, free week), edited in Pages CMS.
// A guide without `parent` is a hub served at /<slug>; a guide with `parent` is served at /<parent>/<slug>.
export type Guide = {
  key: string;
  slug: string;
  parent?: string;
  order?: number;
  title: string;
  seoTitle?: string;
  heading?: string;
  menuLabel: string;
  kicker?: string;
  excerpt: string;
  summary?: string;
  heroImage?: string;
  heroImageAlt?: string;
  newsletter?: boolean;
  faq?: { question: string; answer: string }[];
  updated?: string;
  content: string;
};

function toGuide(entry: Entry): Guide {
  return {
    ...(entry.data as Omit<Guide, "key" | "slug" | "content">),
    updated: toIso(entry.data.updated),
    key: entry.key,
    slug: entry.slug,
    content: entry.content,
  };
}

function readGuide(slug: string, locale: Locale = LOCALE): Guide | null {
  const entry = findBySlug("guides", slug, locale);
  return entry ? toGuide(entry) : null;
}

export function getAllGuides(locale: Locale = LOCALE): Guide[] {
  return readCollection("guides", locale)
    .map(toGuide)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function guidePath(guide: Pick<Guide, "slug" | "parent">) {
  return guide.parent ? `/${guide.parent}/${guide.slug}` : `/${guide.slug}`;
}

export function getHub(slug: string, locale: Locale = LOCALE) {
  const guide = readGuide(slug, locale);
  return guide && !guide.parent ? guide : null;
}

export function getChild(parent: string, slug: string, locale: Locale = LOCALE) {
  const guide = readGuide(slug, locale);
  return guide && guide.parent === parent ? guide : null;
}

export function getChildren(parent: string, locale: Locale = LOCALE) {
  return getAllGuides(locale).filter((guide) => guide.parent === parent);
}

export function getHubs(locale: Locale = LOCALE) {
  return getAllGuides(locale).filter((guide) => !guide.parent);
}

export function guideAlternates(guide: Guide) {
  return entryAlternates("guides", guide.key, (entry) =>
    guidePath({ slug: entry.slug, parent: entry.data.parent ? String(entry.data.parent) : undefined }),
  );
}
