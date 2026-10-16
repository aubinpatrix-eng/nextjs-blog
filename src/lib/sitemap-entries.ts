import { getAllPages, getAllPosts } from "@/lib/api";
import { findByKey } from "@/lib/content";
import { getAllEvents } from "@/lib/events";
import { getAllGuides, guidePath } from "@/lib/guides";
import { href, LOCALE, TAG_SLUGS, type Locale } from "@/lib/i18n";

export type SitemapEntry = { paths: Partial<Record<Locale, string>>; lastModified?: string };

const OTHER: Locale = LOCALE === "fr" ? "en" : "fr";

function both(frPath: string): Partial<Record<Locale, string>> {
  return { fr: frPath, en: href(frPath, "en") };
}

function day(value: unknown) {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

// Every indexable page of the current site, with its address in each language that has it.
export function sitemapEntries(): SitemapEntry[] {
  const posts = getAllPosts();
  const lastPost = day(posts[0] && (posts[0].updated ?? posts[0].date));
  const published = (date: unknown) => new Date(String(date)) <= new Date();

  const counterpart = <T extends { key: string; slug: string }>(
    collection: "posts" | "guides" | "events" | "pages",
    item: T,
    pathOf: (slug: string, data: Record<string, unknown>) => string | null,
    ownPath: string,
  ): Partial<Record<Locale, string>> => {
    const other = findByKey(collection, item.key, OTHER);
    const otherPath = other ? pathOf(other.slug, other.data) : null;
    return { [LOCALE]: ownPath, ...(otherPath && { [OTHER]: otherPath }) };
  };

  return [
    { paths: both("/"), lastModified: lastPost },
    { paths: both("/calculateur-1rm") },
    { paths: both("/calculateur-endurance-zone-athx") },
    { paths: both("/scores-athx") },
    { paths: both("/qui-suis-je") },
    { paths: both("/blog"), lastModified: lastPost },
    ...Object.keys(TAG_SLUGS).map((tag) => ({ paths: both(`/blog/categorie/${tag}`), lastModified: lastPost })),
    ...posts.map((post) => ({
      paths: counterpart("posts", post, (slug, data) => (published(data.date) ? `/blog/${slug}` : null), `/blog/${post.slug}`),
      lastModified: day(post.updated ?? post.date),
    })),
    ...getAllEvents().map((event) => ({
      paths: counterpart("events", event, (slug) => `/${slug}`, `/${event.slug}`),
      lastModified: day(event.updated ?? "2026-09-26"),
    })),
    ...getAllGuides().map((guide) => ({
      paths: counterpart(
        "guides",
        guide,
        (slug, data) => guidePath({ slug, parent: data.parent ? String(data.parent) : undefined }),
        guidePath(guide),
      ),
      lastModified: day(guide.updated ?? "2026-09-27"),
    })),
    ...getAllPages().map((page) => ({ paths: counterpart("pages", page, (slug) => `/${slug}`, `/${page.slug}`) })),
  ];
}
