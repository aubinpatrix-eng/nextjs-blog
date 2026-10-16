import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { LOCALE, languageAlternates, type Locale } from "./i18n";

// Markdown collections, one folder per language: _posts (French) and _posts_en (English), etc.
// A translation is linked to its French version (for hreflang) by its key: the French file name,
// given either by the English file's own name or, for files created in Pages CMS, by `translationOf`.
// Its URL comes from the `slug` field. French URLs use the file name, as before.

export type Collection = "posts" | "guides" | "events" | "pages";

export type Entry = {
  key: string;
  slug: string;
  data: Record<string, unknown>;
  content: string;
};

const cache = new Map<string, Entry[]>();

function collectionDir(collection: Collection, locale: Locale) {
  return join(process.cwd(), locale === "fr" ? `_${collection}` : `_${collection}_en`);
}

export function readCollection(collection: Collection, locale: Locale = LOCALE): Entry[] {
  const id = `${collection}:${locale}`;
  const cached = cache.get(id);
  if (cached && process.env.NODE_ENV === "production") return cached;
  const dir = collectionDir(collection, locale);
  const entries = fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".md"))
        .map((file) => {
          const name = file.replace(/\.md$/, "");
          const { data, content } = matter(fs.readFileSync(join(dir, file), "utf8"));
          const key = locale === "fr" ? name : String(data.translationOf || name);
          const slug = locale === "fr" ? name : String(data.slug || name);
          return { key, slug, data, content };
        })
    : [];
  cache.set(id, entries);
  return entries;
}

export function findBySlug(collection: Collection, slug: string, locale: Locale = LOCALE) {
  return readCollection(collection, locale).find((entry) => entry.slug === slug) ?? null;
}

export function findByKey(collection: Collection, key: string, locale: Locale) {
  return readCollection(collection, locale).find((entry) => entry.key === key) ?? null;
}

// Canonical + hreflang for a CMS entry, given how to build an entry's path in a language.
export function entryAlternates(
  collection: Collection,
  key: string,
  pathOf: (entry: Entry, locale: Locale) => string | null,
) {
  const paths: Partial<Record<Locale, string>> = {};
  for (const locale of ["fr", "en"] as Locale[]) {
    const entry = findByKey(collection, key, locale);
    const path = entry && pathOf(entry, locale);
    if (path) paths[locale] = path;
  }
  return languageAlternates(paths);
}

export function toIso(value: unknown) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value ? String(value) : undefined;
}
