import { getAllPages, getPageBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = {
  params: {
    slug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPages().map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const page = getPageBySlug(params.slug);
  if (!page) {
    return {};
  }
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function StaticPage({ params }: Params) {
  const page = getPageBySlug(params.slug);
  if (!page) {
    notFound();
  }
  const content = await markdownToHtml(page.content);

  return (
    <main>
      <section className="page-hero" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <h1 className="h-page">{page.title}</h1>
        </div>
      </section>
      <section className="last" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    </main>
  );
}
