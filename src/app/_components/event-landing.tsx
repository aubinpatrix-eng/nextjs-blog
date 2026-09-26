import { ArticleFaq, AuthorBox, KeyTakeaways, TableOfContents } from "@/app/_components/article-blocks";
import JsonLd from "@/app/_components/json-ld";
import PrCalculator from "@/app/_components/pr-calculator";
import { getAllEvents, type AthxEvent } from "@/lib/events";
import { markdownToHtmlWithToc, splitAtMiddleHeading } from "@/lib/markdownToHtml";
import { breadcrumbSchema, faqSchema, organizationId, personId, personSchema } from "@/lib/schema";
import { formatPrice, getAbout, getHome, getSite } from "@/lib/site";
import Link from "next/link";

function formatDay(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default async function EventLanding({ event }: { event: AthxEvent }) {
  const site = getSite();
  const home = getHome();
  const about = getAbout();
  const priceLabel = formatPrice(site.price);
  const { content, toc } = await markdownToHtmlWithToc(event.content);
  const [firstHalf, secondHalf] = splitAtMiddleHeading(content);
  const faq = event.faq ?? [];
  if (faq.length > 0) toc.push({ id: "faq", text: "Questions fréquentes", level: 2 });
  const others = getAllEvents().filter((other) => other.slug !== event.slug);
  const url = `${site.url}/${event.slug}`;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: event.title,
              description: event.excerpt,
              ...(event.summary && { abstract: event.summary }),
              datePublished: "2026-09-26",
              dateModified: event.updated ?? "2026-09-26",
              inLanguage: "fr-FR",
              mainEntityOfPage: url,
              image: `${site.url}${event.heroImage ?? about.photo}`,
              about: { "@type": "Thing", name: `ATHX ${event.city} ${event.startDate.slice(0, 4)}` },
              author: { "@id": personId(site) },
              publisher: { "@type": "Organization", "@id": organizationId(site), name: site.name, url: site.url },
              mentions: { "@id": `${site.url}/#course` },
            },
            personSchema(site, about),
            ...(faq.length > 0 ? [faqSchema(faq)] : []),
            breadcrumbSchema(site, [{ name: "Accueil", path: "" }, { name: event.menuLabel }]),
          ],
        }}
      />

      <section className={`hero${event.heroImage ? " hero-photo" : ""}`}>
        {event.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-bg" src={event.heroImage} alt={event.heroImageAlt ?? ""} fetchPriority="high" />
        )}
        <div className="wrap hero-grid">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <ol>
                <li>
                  <Link href="/">Accueil</Link>
                </li>
                <li>{event.menuLabel}</li>
              </ol>
            </nav>
            <div className="kicker">{event.kicker}</div>
            <h1 className="h-hero event-title">{event.heading || event.title}</h1>
            <p className="lede">{event.excerpt}</p>
            <dl className="event-facts">
              <div>
                <dt>Dates</dt>
                <dd>{event.dates}</dd>
              </div>
              <div>
                <dt>Lieu</dt>
                <dd>{event.venue}</dd>
              </div>
              <div>
                <dt>Début de prépa conseillé</dt>
                <dd>{formatDay(event.prepStart)}</dd>
              </div>
              <div>
                <dt>Catégories</dt>
                <dd>Lite, ATHX, Pro · solo ou binôme</dd>
              </div>
            </dl>
            <div className="hero-ctas">
              <a href="#cta" className="btn btn-signal">
                Obtenir mon programme
              </a>
              <a href={toc[0] ? `#${toc[0].id}` : "#contenu"} className="btn btn-ghost">
                Lire le guide
              </a>
            </div>
          </div>
          <div className="hero-card price-badge">
            <div className="price">{priceLabel}</div>
            <p className="note">12 semaines · calculé sur vos PR</p>
          </div>
        </div>
      </section>

      <section id="contenu">
        <div className="wrap">
          {event.summary && <KeyTakeaways summary={event.summary} />}
          {toc.length > 1 && <TableOfContents toc={toc} />}
          <div className="prose" dangerouslySetInnerHTML={{ __html: firstHalf }} />
          {secondHalf && (
            <>
              <aside className={`event-cta${event.ctaImage ? " event-cta-photo" : ""}`}>
                {event.ctaImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.ctaImage} alt="" loading="lazy" />
                )}
                <div className="event-cta-body">
                  <div className="kicker">Objectif ATHX {event.city}</div>
                  <h2>Arrivez prêt pour ATHX {event.city}.</h2>
                  <p>
                    12 semaines de force, d&apos;endurance et de simulations Metcon X, avec des charges calculées sur
                    vos PR. Démarrage conseillé le {formatDay(event.prepStart)}.
                  </p>
                  <a href="#cta" className="btn btn-signal">
                    Accéder à mon programme — {priceLabel}
                  </a>
                </div>
              </aside>
              <div className="prose" dangerouslySetInnerHTML={{ __html: secondHalf }} />
            </>
          )}
          {faq.length > 0 && <ArticleFaq faq={faq} />}
        </div>
      </section>

      {home.personas && home.personas.items.length > 0 && (
        <section className="personas">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec pre-line">{home.personas.title}</h2>
              <p className="lede">{home.personas.lede}</p>
            </div>
            <div className="persona-grid">
              {home.personas.items.map((persona) => (
                <a href="#cta" className="persona" key={persona.title}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={persona.image} alt="" loading="lazy" width={800} height={1067} />
                  <div className="persona-body">
                    <div className="post-tag">{persona.label}</div>
                    <h3>{persona.title}</h3>
                    <p>{persona.text}</p>
                    <span className="persona-cta">Voir mon programme →</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="cta-section" id="cta">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec">
              Entrez vos PR,
              <br />
              préparez ATHX {event.city}
            </h2>
            <p className="lede">{home.cta.lede}</p>
          </div>
          <PrCalculator
            buyUrl={site.buyUrl}
            priceLabel={priceLabel}
            comparePriceLabel={site.comparePrice ? formatPrice(site.comparePrice) : null}
          />
        </div>
      </section>

      <section className="last">
        <div className="wrap">
          <AuthorBox about={about} />
          {others.length > 0 && (
            <nav className="event-others" aria-label="Autres étapes ATHX en France">
              <h2 className="h-sec h-small">Les autres étapes en France</h2>
              <div className="event-others-grid">
                {others.map((other) => (
                  <Link key={other.slug} href={`/${other.slug}`} className="event-other">
                    <span className="post-tag">{other.dates}</span>
                    <strong>{other.menuLabel}</strong>
                    <span className="post-read">Voir le guide</span>
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}
