import { getAllPages, getAllPosts } from "@/lib/api";
import { getAllEvents } from "@/lib/events";
import { getSite } from "@/lib/site";
import { TAGS } from "@/lib/tags";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = getSite();
  const posts = getAllPosts();
  const lastPost = posts[0] ? new Date(posts[0].updated ?? posts[0].date) : new Date();

  return [
    { url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${url}/calculateur-1rm`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${url}/qui-suis-je`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${url}/blog`, lastModified: lastPost, changeFrequency: "weekly", priority: 0.8 },
    ...TAGS.map((tag) => ({ url: `${url}/blog/categorie/${tag.slug}`, lastModified: lastPost, priority: 0.5 })),
    ...posts.map((post) => ({
      url: `${url}/blog/${post.slug}`,
      lastModified: new Date(post.updated ?? post.date),
      priority: 0.7,
    })),
    ...getAllEvents().map((event) => ({
      url: `${url}/${event.slug}`,
      lastModified: new Date(event.updated ?? "2026-09-26"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllPages().map((page) => ({ url: `${url}/${page.slug}`, priority: 0.2 })),
  ];
}
