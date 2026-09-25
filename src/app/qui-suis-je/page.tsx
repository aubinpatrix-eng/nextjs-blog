import JsonLd from "@/app/_components/json-ld";
import PhotoSlider from "@/app/_components/photo-slider";
import { formatPrice, getAbout, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

export function generateMetadata(): Metadata {
  const about = getAbout();
  return {
    title: `Qui suis-je ? ${about.name}, ${about.headline.toLowerCase()}`,
    description: `${about.intro} ${about.headline}. Découvrez l'athlète derrière le programme ATHX PREP.`,
    alternates: { canonical: "/qui-suis-je" },
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
          "@type": "ProfilePage",
          url: `${site.url}/qui-suis-je`,
          mainEntity: {
            "@type": "Person",
            name: about.name,
            description: about.headline,
            image: `${site.url}${about.photo}`,
            url: `${site.url}/qui-suis-je`,
            ...(site.instagram && { sameAs: [site.instagram] }),
          },
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
          <img className="proof-photo" src={about.photo} alt={`${about.name} à l'ATHX Paris 2026`} width={1000} height={1333} />
        </div>
      </section>

      <section className="stat-strip" aria-label="Résultats Strength zone ATHX Paris 2026">
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
            Mon premier ATHX en images
          </h2>
          <PhotoSlider photos={about.photos} />
        </div>
      </section>

      <section className="last">
        <div className="wrap center">
          <h2 className="h-sec">Préparez votre ATHX avec mon programme.</h2>
          <p className="mute" style={{ margin: "14px auto 0" }}>
            12 semaines calculées sur vos PR. Paiement unique de {formatPrice(site.price)}.
          </p>
          <Link href="/#cta" className="btn btn-signal">
            Obtenir mon programme
          </Link>
        </div>
      </section>
    </main>
  );
}
