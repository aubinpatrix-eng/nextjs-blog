import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <section className="page-hero last">
        <div className="wrap">
          <div className="kicker">Erreur 404</div>
          <h1 className="h-page">Zone introuvable.</h1>
          <p className="lede">Cette page n&apos;existe pas ou a été déplacée.</p>
          <div className="hero-ctas">
            <Link href="/" className="btn btn-signal">
              Retour à l&apos;accueil
            </Link>
            <Link href="/blog" className="btn btn-ghost">
              Voir le blog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
