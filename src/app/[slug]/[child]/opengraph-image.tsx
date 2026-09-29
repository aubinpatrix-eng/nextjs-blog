import { getChild, getHub } from "@/lib/guides";
import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "Guide ATHX PREP";
export const size = ogSize;
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string; child: string } }) {
  const guide = getChild(params.slug, params.child);
  return renderOgImage({ kicker: getHub(params.slug)?.menuLabel, title: guide?.title ?? "ATHX PREP" });
}
