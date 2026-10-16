import { entryAlternates, findBySlug, readCollection, type Entry } from "./content";
import { LOCALE, type Locale } from "./i18n";

export type Post = {
  key: string;
  slug: string;
  title: string;
  seoTitle?: string;
  excerpt: string;
  date: string;
  updated?: string;
  tag: string;
  coverImage?: string;
  coverImageAlt?: string;
  author?: string;
  summary?: string;
  faq?: { question: string; answer: string }[];
  content: string;
  readingTime: number;
};

export type Page = {
  key: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
};

function toPost(entry: Entry): Post {
  const words = entry.content.split(/\s+/).filter(Boolean).length;
  return {
    ...(entry.data as Omit<Post, "key" | "slug" | "content" | "readingTime">),
    key: entry.key,
    slug: entry.slug,
    content: entry.content,
    readingTime: Math.max(1, Math.ceil(words / 180)),
  };
}

export function getPostBySlug(slug: string, locale: Locale = LOCALE): Post | null {
  const entry = findBySlug("posts", slug, locale);
  return entry ? toPost(entry) : null;
}

export function getAllPosts(locale: Locale = LOCALE): Post[] {
  return (
    readCollection("posts", locale)
      .map(toPost)
      // Posts dated in the future stay unpublished until the next build after that date.
      .filter((post) => new Date(post.date) <= new Date())
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  );
}

export function postAlternates(post: Post) {
  return entryAlternates("posts", post.key, (entry) =>
    new Date(String(entry.data.date)) <= new Date() ? `/blog/${entry.slug}` : null,
  );
}

function toPage(entry: Entry): Page {
  return { ...(entry.data as Omit<Page, "key" | "slug" | "content">), key: entry.key, slug: entry.slug, content: entry.content };
}

export function getPageBySlug(slug: string, locale: Locale = LOCALE): Page | null {
  const entry = findBySlug("pages", slug, locale);
  return entry ? toPage(entry) : null;
}

export function getAllPages(locale: Locale = LOCALE): Page[] {
  return readCollection("pages", locale).map(toPage);
}

export function pageAlternates(page: Page) {
  return entryAlternates("pages", page.key, (entry) => `/${entry.slug}`);
}
