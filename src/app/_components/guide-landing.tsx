import { ArticleFaq, AuthorBox, KeyTakeaways, TableOfContents } from "@/app/_components/article-blocks";
import JsonLd from "@/app/_components/json-ld";
import NewsletterForm from "@/app/_components/newsletter-form";
import { getChildren, getHub, guidePath, type Guide } from "@/lib/guides";
import { markdownToHtmlWithToc, splitAtMiddleHeading } from "@/lib/markdownToHtml";
import { breadcrumbSchema, faqSchema, organizationId, personId, personSchema } from "@/lib/schema";
import { formatPrice, getAbout, getSite } from "@/lib/site";
import Link from "next/link";

export default async function GuideLanding({ guide }: { guide: Guide }) {
  const site = getSite();
  const about = getAbout();
  const priceLabel = formatPrice(site.price);
  const hub = guide.parent ? getHub(guide.parent) : null;
  const children = guide.parent ? [] : getChildren(guide.slug);
  const siblings = hub ? getChildren(hub.slug).filter((other) => other.slug !== guide.slug) : [];
  const { content, toc } = await markdownToHtmlWithToc(guide.content);
  const [firstHalf, secondHalf] = splitAtMiddleHeading(content);
  const faq = guide.faq ?? [];
  if (children.length > 0) toc.push({ id: "pages-du-guide", text: "Les pages de ce guide", level: 2 });
  if (faq.length > 0) toc.push({ id: "faq", text: "Questions fréquentes", level: 2 });
  const path = guidePath(guide);
  const url = `${site.url}${path}`;
  const crumbs = [
    { name: "Accueil", path: "" },
    ...(hub ? [{ name: hub.menuLabel, path: guidePath(hub) }] : []),
    { name: guide.menuLabel },
  ];

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              "@id": `${url}#article`,
              headline: guide.title,
              description: guide.excerpt,
              ...(guide.summary && { abstract: guide.summary }),
              datePublished: "2026-09-27",
              dateModified: guide.updated ?? "2026-09-27",
              inLanguage: "fr-FR",
              mainEntityOfPage: url,
              image: `${site.url}${guide.heroImage ?? about.photo}`,
              author: { "@id": personId(site) },
              publisher: { "@type": "Organization", "@id": organizationId(site), name: site.name, url: site.url },
              ...(hub && { isPartOf: { "@id": `${site.url}${guidePath(hub)}#article` } }),
              ...(children.length > 0 && {
                hasPart: children.map((child) => ({ "@id": `${site.url}${guidePath(child)}#article` })),
              }),
            },
            personSchema(site, about),
            ...(faq.length > 0 ? [faqSchema(faq)] : []),
            breadcrumbSchema(site, crumbs),
          ],
        }}
      />

      <section className={`hero${guide.heroImage ? " hero-photo" : ""}`}>
        {guide.heroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-bg" src={guide.heroImage} alt={guide.heroImageAlt ?? ""} fetchPriority="high" />
        )}
        <div className="wrap hero-grid">
          <div>
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <ol>
                <li>
                  <Link href="/">Accueil</Link>
                </li>
                {hub && (
                  <li>
                    <Link href={guidePath(hub)}>{hub.menuLabel}</Link>
                  </li>
                )}
                <li>{guide.menuLabel}</li>
              </ol>
            </nav>
            {guide.kicker && <div className="kicker">{guide.kicker}</div>}
            <h1 className="h-hero event-title">{guide.heading || guide.title}</h1>
            <p className="lede">{guide.excerpt}</p>
            <div className="hero-ctas">
              <a href="#contenu" className="btn btn-ghost">
                Lire le guide
              </a>
              <Link href="/#cta" className="btn btn-signal">
                Mon programme — {priceLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contenu">
        <div className="wrap">
          {guide.summary && <KeyTakeaways summary={guide.summary} />}
          {toc.length > 1 && <TableOfContents toc={toc} />}
          <div className="prose" dangerouslySetInnerHTML={{ __html: firstHalf }} />
          {secondHalf && (
            <>
              <aside className="event-cta">
                <div className="event-cta-body">
                  <div className="kicker">Programme ATHX PREP</div>
                  <h2>Préparez chaque zone avec un plan calculé sur vos PR.</h2>
                  <p>12 semaines de force, d&apos;endurance et de simulations Metcon X, adaptées à votre catégorie.</p>
                  <Link href="/#cta" className="btn btn-signal">
                    Accéder à mon programme — {priceLabel}
                  </Link>
                </div>
              </aside>
              <div className="prose" dangerouslySetInnerHTML={{ __html: secondHalf }} />
            </>
          )}

          {children.length > 0 && (
            <nav className="guide-children" aria-labelledby="pages-du-guide">
              <h2 id="pages-du-guide" className="h-sec h-small">
                Les pages de ce guide
              </h2>
              <div className="event-others-grid guide-children-grid">
                {children.map((child) => (
                  <Link key={child.slug} href={guidePath(child)} className="event-other">
                    {child.kicker && <span className="post-tag">{child.kicker}</span>}
                    <strong>{child.menuLabel}</strong>
                    <span className="event-venue">{child.excerpt}</span>
                    <span className="post-read">Lire la page</span>
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {faq.length > 0 && <ArticleFaq faq={faq} />}
          <NewsletterForm source={guide.slug} />
        </div>
      </section>

      <section className="last">
        <div className="wrap">
          <AuthorBox about={about} />
          {siblings.length > 0 && hub && (
            <nav className="event-others" aria-label={`Autres pages : ${hub.menuLabel}`}>
              <h2 className="h-sec h-small">À voir aussi : {hub.menuLabel}</h2>
              <div className="event-others-grid">
                {siblings.map((other) => (
                  <Link key={other.slug} href={guidePath(other)} className="event-other">
                    {other.kicker && <span className="post-tag">{other.kicker}</span>}
                    <strong>{other.menuLabel}</strong>
                    <span className="post-read">Lire la page</span>
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
