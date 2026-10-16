import { getPostBySlug } from "@/lib/api";
import { ogSize, renderOgImage } from "@/lib/og-image";
import { isEn } from "@/lib/i18n";
import { getTag } from "@/lib/tags";

export const alt = isEn ? "ATHX PREP blog article" : "Article du blog ATHX PREP";
export const size = ogSize;
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const tag = post && getTag(post.tag);
  return renderOgImage({ kicker: tag ? `Blog · ${tag.label}` : "Blog", title: post?.title ?? "ATHX PREP" });
}
