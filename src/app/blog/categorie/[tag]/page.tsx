import BlogList from "@/app/_components/blog-list";
import { getAllPosts } from "@/lib/api";
import { isEn, languageAlternates, TAG_SLUGS } from "@/lib/i18n";
import { getTag, TAGS } from "@/lib/tags";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = {
  params: {
    tag: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return TAGS.map((tag) => ({ tag: tag.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const tag = getTag(params.tag);
  if (!tag) {
    return {};
  }
  const frSlug = isEn ? (Object.keys(TAG_SLUGS).find((fr) => TAG_SLUGS[fr] === tag.slug) ?? tag.slug) : tag.slug;
  return {
    title: isEn ? `${tag.label} — Prepare for ATHX` : `${tag.label} — Préparer l'ATHX`,
    description: tag.description,
    alternates: languageAlternates({ fr: `/blog/categorie/${frSlug}`, en: `/blog/category/${TAG_SLUGS[frSlug] ?? frSlug}` }),
  };
}

export default function Category({ params }: Params) {
  const tag = getTag(params.tag);
  if (!tag) {
    notFound();
  }
  const posts = getAllPosts().filter((post) => getTag(post.tag)?.slug === tag.slug);

  return <BlogList title={`ATHX : ${tag.label}`} lede={tag.description} posts={posts} activeTag={tag.slug} />;
}
