import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updated?: string;
  tag: string;
  coverImage?: string;
  author?: string;
  content: string;
  readingTime: number;
};

export type Page = {
  slug: string;
  title: string;
  description?: string;
  content: string;
};

const postsDirectory = join(process.cwd(), "_posts");
const pagesDirectory = join(process.cwd(), "_pages");

function listMarkdown(directory: string) {
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function readMarkdown(directory: string, slug: string) {
  const fullPath = join(directory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  return matter(fs.readFileSync(fullPath, "utf8"));
}

export function getPostBySlug(slug: string): Post | null {
  const file = readMarkdown(postsDirectory, slug);
  if (!file) {
    return null;
  }
  const words = file.content.split(/\s+/).filter(Boolean).length;
  return {
    ...(file.data as Omit<Post, "slug" | "content" | "readingTime">),
    slug,
    content: file.content,
    readingTime: Math.max(1, Math.ceil(words / 180)),
  };
}

export function getAllPosts(): Post[] {
  return (
    listMarkdown(postsDirectory)
      .map((slug) => getPostBySlug(slug) as Post)
      // Posts dated in the future stay unpublished until the next build after that date.
      .filter((post) => new Date(post.date) <= new Date())
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  );
}

export function getPageBySlug(slug: string): Page | null {
  const file = readMarkdown(pagesDirectory, slug);
  if (!file) {
    return null;
  }
  return { ...(file.data as Omit<Page, "slug" | "content">), slug, content: file.content };
}

export function getAllPages(): Page[] {
  return listMarkdown(pagesDirectory).map((slug) => getPageBySlug(slug) as Page);
}
