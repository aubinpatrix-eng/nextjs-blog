import EventLanding from "@/app/_components/event-landing";
import GuideLanding from "@/app/_components/guide-landing";
import { getAllPages, getPageBySlug } from "@/lib/api";
import { getAllEvents, getEventBySlug } from "@/lib/events";
import { getHub, getHubs } from "@/lib/guides";
import markdownToHtml from "@/lib/markdownToHtml";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = {
  params: {
    slug: string;
  };
};

export const dynamicParams = false;

// Serves the simple pages (_pages: legal…), the city landing pages (_events) and the guide hubs (_guides).
export function generateStaticParams() {
  return [...getAllPages(), ...getAllEvents(), ...getHubs()].map((page) => ({ slug: page.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const hub = getHub(params.slug);
  if (hub) {
    return {
      title: hub.title,
      description: hub.excerpt,
      alternates: { canonical: `/${hub.slug}` },
      openGraph: { type: "article", title: hub.title, description: hub.excerpt, ...(hub.heroImage && { images: [hub.heroImage] }) },
    };
  }
  const event = getEventBySlug(params.slug);
  if (event) {
    return {
      title: event.title,
      description: event.excerpt,
      alternates: { canonical: `/${event.slug}` },
      openGraph: {
        type: "article",
        title: event.title,
        description: event.excerpt,
        ...(event.heroImage && { images: [event.heroImage] }),
      },
    };
  }
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
  const hub = getHub(params.slug);
  if (hub) {
    return <GuideLanding guide={hub} />;
  }
  const event = getEventBySlug(params.slug);
  if (event) {
    return <EventLanding event={event} />;
  }
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
