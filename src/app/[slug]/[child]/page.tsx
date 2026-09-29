import GuideLanding from "@/app/_components/guide-landing";
import { getAllGuides, getChild, guidePath } from "@/lib/guides";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = {
  params: {
    slug: string;
    child: string;
  };
};

export const dynamicParams = false;

// Guide pages that belong to a hub: /<hub>/<page>.
export function generateStaticParams() {
  return getAllGuides()
    .filter((guide) => guide.parent)
    .map((guide) => ({ slug: guide.parent as string, child: guide.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const guide = getChild(params.slug, params.child);
  if (!guide) return {};
  return {
    title: guide.seoTitle || guide.title,
    description: guide.excerpt,
    alternates: { canonical: guidePath(guide) },
    openGraph: { type: "article", title: guide.title, description: guide.excerpt },
  };
}

export default async function GuideChildPage({ params }: Params) {
  const guide = getChild(params.slug, params.child);
  if (!guide) notFound();
  return <GuideLanding guide={guide} />;
}
