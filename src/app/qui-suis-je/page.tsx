import JsonLd from "@/app/_components/json-ld";
import PhotoSlider from "@/app/_components/photo-slider";
import { href, isEn, staticAlternates, UI } from "@/lib/i18n";
import { breadcrumbSchema, personId, personSchema } from "@/lib/schema";
import { formatPrice, getAbout, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

const COPY = isEn
  ? {
      title: (name: string) => `${name}: my ATHX journey`,
      description: (intro: string, headline: string) => `${intro} ${headline}. Meet the athlete behind the ATHX PREP program.`,
      crumb: "About",
      photoAlt: (name: string) => `${name} at ATHX Paris 2026`,
      statsLabel: "Strength zone results, ATHX Paris 2026",
      gallery: "My first ATHX in pictures",
      ctaTitle: "Prepare for your ATHX with my program.",
      ctaText: (price: string) => `12 weeks built on your PRs. One-off payment of ${price}. Program written in French.`,
      cta: "Get my program",
    }
  : {
      title: (name: string) => `${name} : mon parcours ATHX`,
      description: (intro: string, headline: string) =>
        `${intro} ${headline}. Découvrez l'athlète derrière le programme ATHX PREP.`,
      crumb: "Qui suis-je",
      photoAlt: (name: string) => `${name} à l'ATHX Paris 2026`,
      statsLabel: "Résultats Strength zone ATHX Paris 2026",
      gallery: "Mon premier ATHX en images",
      ctaTitle: "Préparez votre ATHX avec mon programme.",
      ctaText: (price: string) => `12 semaines calculées sur vos PR. Paiement unique de ${price}.`,
      cta: "Obtenir mon programme",
    };

export function generateMetadata(): Metadata {
  const about = getAbout();
  return {
    title: COPY.title(about.name),
    description: COPY.description(about.intro, about.headline),
    alternates: staticAlternates("/qui-suis-je"),
    openGraph: { type: "profile", images: [about.photo] },
  };
}

export default function About() {
  const site = getSite();
  const about = getAbout();

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ProfilePage",
              url: `${site.url}${href("/qui-suis-je")}`,
              mainEntity: { "@id": personId(site) },
            },
            personSchema(site, about),
            breadcrumbSchema(site, [{ name: UI.home, path: "" }, { name: COPY.crumb }]),
          ],
        }}
      />

      <section className="hero">
        <div className="wrap hero-grid about-grid">
          <div>
            <div className="kicker">{about.kicker}</div>
            <h1 className="h-page">{about.title}</h1>
            <p className="lede">{about.intro}</p>
            <p className="about-headline">{about.headline}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="proof-photo" src={about.photo} alt={COPY.photoAlt(about.name)} width={1000} height={1333} />
        </div>
      </section>

      <section className="stat-strip" aria-label={COPY.statsLabel}>
        <div className="wrap about-stats">
          {about.results.map((result) => (
            <div className="stat" key={result.label}>
              <div className="num">{result.value}</div>
              <p>{result.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="prose">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <figure className="proof-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={about.proofImage} alt={about.proofCaption} width={1400} height={167} />
            <figcaption>{about.proofCaption}</figcaption>
          </figure>
        </div>
      </section>

      <section>
        <div className="wrap">
          <h2 className="h-sec h-small" style={{ marginBottom: 32 }}>
            {COPY.gallery}
          </h2>
          <PhotoSlider photos={about.photos} />
        </div>
      </section>

      <section className="last">
        <div className="wrap center">
          <h2 className="h-sec">{COPY.ctaTitle}</h2>
          <p className="mute" style={{ margin: "14px auto 0" }}>
            {COPY.ctaText(formatPrice(site.price))}
          </p>
          <Link href="/#cta" className="btn btn-signal">
            {COPY.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
