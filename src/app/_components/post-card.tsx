import type { Post } from "@/lib/api";
import { isEn, LANG_TAG, LOCALE } from "@/lib/i18n";
import { getTag } from "@/lib/tags";
import Link from "next/link";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  return (
    <article className="post-card">
      <div className="post-tag">{getTag(post.tag)?.label ?? post.tag}</div>
      <h3>
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </h3>
      <p className="excerpt">{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="post-read" aria-hidden tabIndex={-1}>
        {isEn ? "Read the article" : "Lire l'article"}
      </Link>
      <div className="post-meta">
        <span>
          {post.readingTime} {isEn ? "min read" : "min de lecture"}
        </span>
        <DateLabel date={post.date} />
      </div>
    </article>
  );
}

export function DateLabel({ date }: { date: string }) {
  return (
    <time dateTime={date}>
      {new Date(date).toLocaleDateString(LANG_TAG[LOCALE], { day: "numeric", month: "long", year: "numeric" })}
    </time>
  );
}
