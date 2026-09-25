import { getAbout } from "@/lib/site";
import Link from "next/link";

// Social proof block: the author's ATHX Paris 2026 strength ranking.
export default function Proof() {
  const about = getAbout();

  return (
    <section className="proof">
      <div className="wrap proof-grid">
        <div>
          <div className="kicker">Conçu par un athlète ATHX</div>
          <h2 className="h-sec">{about.headline}</h2>
          <p className="lede mute">
            {about.name}, créateur d&apos;ATHX PREP, a remporté la Strength zone de sa première compétition, toutes
            catégories confondues.
          </p>
          <div className="proof-results">
            {about.results.map((result) => (
              <div key={result.label}>
                <div className="num">{result.value}</div>
                <p>{result.label}</p>
              </div>
            ))}
          </div>
          <figure className="proof-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={about.proofImage} alt={about.proofCaption} width={1400} height={167} loading="lazy" />
            <figcaption>{about.proofCaption}</figcaption>
          </figure>
          <div className="hero-ctas">
            <a href="/#cta" className="btn btn-signal">
              Obtenir mon programme
            </a>
            <Link href="/qui-suis-je" className="btn btn-ghost">
              Qui suis-je ?
            </Link>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="proof-photo" src={about.photo} alt={`${about.name} dans la Strength zone de l'ATHX Paris 2026`} width={1000} height={1333} loading="lazy" />
      </div>
    </section>
  );
}
