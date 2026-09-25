import JsonLd from "@/app/_components/json-ld";
import PostCard from "@/app/_components/post-card";
import PrCalculator from "@/app/_components/pr-calculator";
import Proof from "@/app/_components/proof";
import { getAllPosts } from "@/lib/api";
import { formatPrice, getHome, getSite } from "@/lib/site";
import Link from "next/link";

export default function Index() {
  const site = getSite();
  const home = getHome();
  const latestPosts = getAllPosts().slice(0, 3);
  const priceLabel = formatPrice(site.price);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${site.url}/#organization`,
              name: site.name,
              url: site.url,
              ...(site.instagram && { sameAs: [site.instagram] }),
            },
            {
              "@type": "WebSite",
              name: site.name,
              url: site.url,
              inLanguage: "fr-FR",
              publisher: { "@id": `${site.url}/#organization` },
            },
            {
              "@type": "Product",
              name: `Programme de préparation ATHX — ${site.name}`,
              description: home.program.lede,
              brand: { "@id": `${site.url}/#organization` },
              offers: {
                "@type": "Offer",
                price: site.price.toFixed(2),
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: `${site.url}/#cta`,
              },
            },
            {
              "@type": "FAQPage",
              mainEntity: home.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />

      <section className="hero" id="home">
        <div className="wrap hero-grid">
          <div>
            <div className="kicker">{home.hero.kicker}</div>
            <h1 className="h-hero pre-line">{home.hero.title}</h1>
            <p className="lede">{home.hero.lede}</p>
            <div className="hero-ctas">
              <a href="#cta" className="btn btn-signal">
                Obtenir mon programme
              </a>
              <a href="#format" className="btn btn-ghost">
                Voir le format ATHX
              </a>
            </div>
          </div>
          <div className="hero-card">
            <div className="price">{priceLabel}</div>
            <p className="note">{home.hero.offerNote}</p>
            <ul>
              {home.hero.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="stat-strip" aria-label="L'ATHX en chiffres">
        <div className="wrap">
          {home.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="num">{stat.value}</div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Proof />

      <section id="format">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec pre-line">{home.format.title}</h2>
            <p className="lede">{home.format.lede}</p>
          </div>
          <ol className="zones" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {home.format.zones.map((zone, index) => (
              <li className="zone" key={zone.name}>
                <div className="zone-num" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3>{zone.name}</h3>
                  <p className="zone-desc">{zone.description}</p>
                </div>
                <div className="zone-time">{zone.duration}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="programme">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec pre-line">{home.program.title}</h2>
            <p className="lede">{home.program.lede}</p>
          </div>
          <div className="program-grid">
            {home.program.blocks.map((block) => (
              <div className="program-cell" key={block.title}>
                <h3>{block.title}</h3>
                <p>{block.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" id="cta">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec pre-line">{home.cta.title}</h2>
            <p className="lede">{home.cta.lede}</p>
          </div>
          <PrCalculator
            buyUrl={site.buyUrl}
            priceLabel={priceLabel}
            comparePriceLabel={site.comparePrice ? formatPrice(site.comparePrice) : null}
          />
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <h2 className="h-sec" style={{ marginBottom: 40 }}>
            Questions fréquentes
          </h2>
          {home.faq.map((item, index) => (
            <details className="faq-item" key={item.question} open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section>
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec">Derniers articles</h2>
              <Link href="/blog" className="post-read">
                Tous les articles
              </Link>
            </div>
            <div className="blog-grid">
              {latestPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="last">
        <div className="wrap center">
          <h2 className="h-sec">{home.finalCta}</h2>
          <a href="#cta" className="btn btn-signal">
            Obtenir mon programme — {priceLabel}
          </a>
        </div>
      </section>
    </main>
  );
}
