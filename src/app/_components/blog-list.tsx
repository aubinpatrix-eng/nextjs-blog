import JsonLd from "@/app/_components/json-ld";
import Newsletter from "@/app/_components/newsletter";
import PostCard from "@/app/_components/post-card";
import type { Post } from "@/lib/api";
import { isEn, LANG_TAG, LOCALE } from "@/lib/i18n";
import { breadcrumbSchema } from "@/lib/schema";
import { getSite } from "@/lib/site";
import { getTag, TAGS } from "@/lib/tags";
import Link from "next/link";

type Props = {
  title: React.ReactNode;
  lede: string;
  posts: Post[];
  activeTag?: string;
};

export default function BlogList({ title, lede, posts, activeTag }: Props) {
  const site = getSite();
  const tag = activeTag ? getTag(activeTag) : undefined;
  const categoryPath = (slug: string) => (isEn ? `/blog/category/${slug}` : `/blog/categorie/${slug}`);
  const path = tag ? categoryPath(tag.slug) : "/blog";

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              name: tag ? `ATHX : ${tag.label}` : "Blog ATHX PREP",
              description: lede,
              url: `${site.url}${path}`,
              inLanguage: LANG_TAG[LOCALE],
              mainEntity: {
                "@type": "ItemList",
                itemListElement: posts.map((post, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url: `${site.url}/blog/${post.slug}`,
                })),
              },
            },
            breadcrumbSchema(site, [
              { name: isEn ? "Home" : "Accueil", path: "" },
              ...(tag ? [{ name: "Blog", path: "/blog" }, { name: tag.label }] : [{ name: "Blog" }]),
            ]),
          ],
        }}
      />
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">Blog ATHX PREP</div>
          <h1 className="h-page">{title}</h1>
          <p className="lede">{lede}</p>
          <nav className="blog-filters" aria-label={isEn ? "Categories" : "Catégories"}>
            <Link href="/blog" className={`tag-btn${activeTag ? "" : " active"}`}>
              {isEn ? "All" : "Tous"}
            </Link>
            {TAGS.map((tag) => (
              <Link
                key={tag.slug}
                href={categoryPath(tag.slug)}
                className={`tag-btn${activeTag === tag.slug ? " active" : ""}`}
              >
                {tag.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="last">
        <div className="wrap">
          {posts.length > 0 ? (
            <div className="blog-grid">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="empty">{isEn ? "No articles yet." : "Aucun article pour le moment."}</p>
          )}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
