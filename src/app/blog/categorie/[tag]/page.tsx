import BlogList from "@/app/_components/blog-list";
import { getAllPosts } from "@/lib/api";
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
  return {
    title: `${tag.label} — Préparer l'ATHX`,
    description: tag.description,
    alternates: { canonical: `/blog/categorie/${tag.slug}` },
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
