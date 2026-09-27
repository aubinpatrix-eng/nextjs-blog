import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

// Evergreen guide pages (workouts, categories, movements, free week), edited in Pages CMS.
// A guide without `parent` is a hub served at /<slug>; a guide with `parent` is served at /<parent>/<slug>.
export type Guide = {
  slug: string;
  parent?: string;
  order?: number;
  title: string;
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

const guidesDirectory = join(process.cwd(), "_guides");

function toIso(value: unknown) {
  return value instanceof Date ? value.toISOString().slice(0, 10) : value ? String(value) : undefined;
}

function readGuide(slug: string): Guide | null {
  const fullPath = join(guidesDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const { data, content } = matter(fs.readFileSync(fullPath, "utf8"));
  return { ...(data as Omit<Guide, "slug" | "content">), updated: toIso(data.updated), slug, content };
}

export function getAllGuides(): Guide[] {
  if (!fs.existsSync(guidesDirectory)) return [];
  return fs
    .readdirSync(guidesDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => readGuide(file.replace(/\.md$/, "")) as Guide)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function guidePath(guide: Pick<Guide, "slug" | "parent">) {
  return guide.parent ? `/${guide.parent}/${guide.slug}` : `/${guide.slug}`;
}

export function getHub(slug: string) {
  const guide = readGuide(slug);
  return guide && !guide.parent ? guide : null;
}

export function getChild(parent: string, slug: string) {
  const guide = readGuide(slug);
  return guide && guide.parent === parent ? guide : null;
}

export function getChildren(parent: string) {
  return getAllGuides().filter((guide) => guide.parent === parent);
}

export function getHubs() {
  return getAllGuides().filter((guide) => !guide.parent);
}
