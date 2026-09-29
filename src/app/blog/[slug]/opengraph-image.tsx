import { getPostBySlug } from "@/lib/api";
import { ogSize, renderOgImage } from "@/lib/og-image";
import { getTag } from "@/lib/tags";

export const alt = "Article du blog ATHX PREP";
export const size = ogSize;
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  const tag = post && getTag(post.tag);
  return renderOgImage({ kicker: tag ? `Blog · ${tag.label}` : "Blog", title: post?.title ?? "ATHX PREP" });
}
