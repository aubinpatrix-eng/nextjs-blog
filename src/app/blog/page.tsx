import BlogList from "@/app/_components/blog-list";
import { getAllPosts } from "@/lib/api";
import { isEn, staticAlternates } from "@/lib/i18n";
import { Metadata } from "next";

const description = isEn
  ? "Strength, endurance, nutrition, mindset: everything you need to know to prepare for ATHX and arrive ready on competition day."
  : "Force, endurance, nutrition, mental : tout ce qu'il faut savoir pour préparer l'ATHX et arriver prêt le jour de la compétition.";

export const metadata: Metadata = {
  title: isEn ? "Blog — Understand and prepare for ATHX" : "Blog — Comprendre et préparer l'ATHX",
  description,
  alternates: staticAlternates("/blog"),
};

export default function Blog() {
  return (
    <BlogList
      title={
        isEn ? (
          <>
            Understand and
            <br />
            prepare for ATHX
          </>
        ) : (
          <>
            Comprendre et
            <br />
            préparer l&apos;ATHX
          </>
        )
      }
      lede={description}
      posts={getAllPosts()}
    />
  );
}
