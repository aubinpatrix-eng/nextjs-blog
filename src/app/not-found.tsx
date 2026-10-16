import PostCard from "@/app/_components/post-card";
import PrCalculator from "@/app/_components/pr-calculator";
import { getAllPosts } from "@/lib/api";
import { isEn } from "@/lib/i18n";
import { formatPrice, getHome, getSite } from "@/lib/site";
import Link from "next/link";

const COPY = isEn
  ? {
      kicker: "Error 404",
      title: ["Zone", "not found."],
      lede: "This page doesn't exist or has moved. No panic: here is what you need to get back to your training.",
      home: "Back to home",
      program: "Get my program",
      blog: "On the blog",
      allPosts: "All articles",
    }
  : {
      kicker: "Erreur 404",
      title: ["Zone", "introuvable."],
      lede: "Cette page n'existe pas ou a été déplacée. Pas de panique : voici de quoi reprendre votre préparation.",
      home: "Retour à l'accueil",
      program: "Obtenir mon programme",
      blog: "À lire sur le blog",
      allPosts: "Tous les articles",
    };

export default function NotFound() {
  const site = getSite();
  const home = getHome();
  const posts = getAllPosts().slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <div className="kicker">{COPY.kicker}</div>
          <h1 className="h-hero">
            {COPY.title[0]}
            <br />
            {COPY.title[1]}
          </h1>
          <p className="lede">{COPY.lede}</p>
          <div className="hero-ctas">
            <Link href="/" className="btn btn-signal">
              {COPY.home}
            </Link>
            <a href="#cta" className="btn btn-ghost">
              {COPY.program}
            </a>
          </div>
        </div>
      </section>

      {posts.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec h-small">{COPY.blog}</h2>
              <Link href="/blog" className="post-read">
                {COPY.allPosts}
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
