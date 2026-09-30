import { getAllPages, getAllPosts } from "@/lib/api";
import { getAllEvents } from "@/lib/events";
import { getAllGuides, guidePath } from "@/lib/guides";
import { getSite } from "@/lib/site";
import { TAGS } from "@/lib/tags";
import type { MetadataRoute } from "next";

// Google ignores priority and changeFrequency: only real modification dates are listed.
export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = getSite();
  const posts = getAllPosts();
  const lastPost = posts[0] ? new Date(posts[0].updated ?? posts[0].date) : new Date();

  return [
    { url, lastModified: lastPost },
    { url: `${url}/calculateur-1rm` },
    { url: `${url}/calculateur-endurance-zone-athx` },
    { url: `${url}/scores-athx` },
    { url: `${url}/qui-suis-je` },
    { url: `${url}/blog`, lastModified: lastPost },
    ...TAGS.map((tag) => ({ url: `${url}/blog/categorie/${tag.slug}`, lastModified: lastPost })),
    ...posts.map((post) => ({ url: `${url}/blog/${post.slug}`, lastModified: new Date(post.updated ?? post.date) })),
    ...getAllEvents().map((event) => ({ url: `${url}/${event.slug}`, lastModified: new Date(event.updated ?? "2026-09-26") })),
    ...getAllGuides().map((guide) => ({ url: `${url}${guidePath(guide)}`, lastModified: new Date(guide.updated ?? "2026-09-27") })),
    ...getAllPages().map((page) => ({ url: `${url}/${page.slug}` })),
  ];
}
