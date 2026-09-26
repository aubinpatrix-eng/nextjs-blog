import PostCard from "@/app/_components/post-card";
import PrCalculator from "@/app/_components/pr-calculator";
import { getAllPosts } from "@/lib/api";
import { formatPrice, getHome, getSite } from "@/lib/site";
import Link from "next/link";

export default function NotFound() {
  const site = getSite();
  const home = getHome();
  const posts = getAllPosts().slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">Erreur 404</div>
          <h1 className="h-hero">
            Zone
            <br />
            introuvable.
          </h1>
          <p className="lede">
            Cette page n&apos;existe pas ou a été déplacée. Pas de panique : voici de quoi reprendre votre préparation.
          </p>
          <div className="hero-ctas">
            <Link href="/" className="btn btn-signal">
              Retour à l&apos;accueil
            </Link>
            <a href="#cta" className="btn btn-ghost">
              Obtenir mon programme
            </a>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec h-small">À lire sur le blog</h2>
              <Link href="/blog" className="post-read">
                Tous les articles
              </Link>
            </div>
            <div className="blog-grid blog-grid-4">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-section last" id="cta">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec pre-line">{home.cta.title}</h2>
            <p className="lede">{home.cta.lede}</p>
          </div>
          <PrCalculator
            buyUrl={site.buyUrl}
            priceLabel={formatPrice(site.price)}
            comparePriceLabel={site.comparePrice ? formatPrice(site.comparePrice) : null}
          />
        </div>
      </section>
    </main>
  );
}
