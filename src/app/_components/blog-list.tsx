import Newsletter from "@/app/_components/newsletter";
import PostCard from "@/app/_components/post-card";
import type { Post } from "@/lib/api";
import { TAGS } from "@/lib/tags";
import Link from "next/link";

type Props = {
  title: React.ReactNode;
  lede: string;
  posts: Post[];
  activeTag?: string;
};

export default function BlogList({ title, lede, posts, activeTag }: Props) {
  return (
    <main>
      <section className="page-hero">
        <div className="wrap">
          <div className="kicker">Blog ATHX PREP</div>
          <h1 className="h-page">{title}</h1>
          <p className="lede">{lede}</p>
          <nav className="blog-filters" aria-label="Catégories">
            <Link href="/blog" className={`tag-btn${activeTag ? "" : " active"}`}>
              Tous
            </Link>
            {TAGS.map((tag) => (
              <Link
                key={tag.slug}
                href={`/blog/categorie/${tag.slug}`}
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
            <p className="empty">Aucun article pour le moment.</p>
          )}
        </div>
      </section>

      <Newsletter />
    </main>
  );
}
