import { getPageBySlug } from "@/lib/api";
import { getEventBySlug } from "@/lib/events";
import { getHub } from "@/lib/guides";
import { ogSize, renderOgImage } from "@/lib/og-image";

export const alt = "ATHX PREP — préparation ATHX";
export const size = ogSize;
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const item = getHub(params.slug) ?? getEventBySlug(params.slug);
  if (item) return renderOgImage({ kicker: item.kicker, title: item.title });
  return renderOgImage({ title: getPageBySlug(params.slug)?.title ?? "ATHX PREP" });
}
