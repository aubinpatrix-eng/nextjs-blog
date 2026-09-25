import BlogList from "@/app/_components/blog-list";
import { getAllPosts } from "@/lib/api";
import { Metadata } from "next";

const description =
  "Force, endurance, nutrition, mental : tout ce qu'il faut savoir pour préparer l'ATHX et arriver prêt le jour de la compétition.";

export const metadata: Metadata = {
  title: "Blog — Comprendre et préparer l'ATHX",
  description,
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  return (
    <BlogList
      title={
        <>
          Comprendre et
          <br />
          préparer l&apos;ATHX
        </>
      }
      lede={description}
      posts={getAllPosts()}
    />
  );
}
