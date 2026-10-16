import { ArticleFaq, AuthorBox, KeyTakeaways, TableOfContents } from "@/app/_components/article-blocks";
import JsonLd from "@/app/_components/json-ld";
import NewsletterForm from "@/app/_components/newsletter-form";
import { getChildren, getHub, guidePath, type Guide } from "@/lib/guides";
import { isEn, UI } from "@/lib/i18n";
import { localPath } from "@/lib/paths";
import { markdownToHtmlWithToc, splitAtMiddleHeading } from "@/lib/markdownToHtml";
import { breadcrumbSchema, faqSchema, organizationId, personId, personSchema } from "@/lib/schema";
import { formatPrice, getAbout, getSite } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

const COPY = isEn
  ? {
      guidePages: "Pages in this guide",
      pdfTitle: "Get the free week as a PDF",
      pdfText:
        "Sign up and confirm your email: the printable PDF (5 sessions, 8 pages) downloads right after. Then one email a week with training tips. Unsubscribe in one click.",
      pdfButton: "Get the PDF",
      breadcrumb: "Breadcrumb",
      getFreeWeek: "Get the free week (PDF)",
      seeSessions: "See the sessions",
      readGuide: "Read the guide",
      myProgram: "My program",
      freeKicker: "Free · Printable PDF",
      freeTitle: "Get these 5 sessions as a PDF.",
      freeText: "The 8-page PDF, with a box to note your maxes and a notes page for each session.",
      freeButton: "Get the free week",
      programKicker: "ATHX PREP program",
      programTitle: "Prepare every zone with a plan built on your PRs.",
      programText: "12 weeks of strength, endurance and Metcon X simulations, adapted to your category. Program written in French.",
      accessProgram: "Get my program",
      notDecided: "Not sure yet?",
      tryFree: "Try a free week as a PDF",
      readPage: "Read the page",
      otherPages: "Other pages",
      seeAlso: "See also",
    }
  : {
      guidePages: "Les pages de ce guide",
      pdfTitle: "Recevez la semaine gratuite en PDF",
      pdfText:
        "Inscrivez-vous et confirmez votre adresse : le PDF imprimable (5 séances, 8 pages) se télécharge juste après. Ensuite, un e-mail par semaine avec des conseils de préparation. Désinscription en un clic.",
      pdfButton: "Recevoir le PDF",
      breadcrumb: "Fil d'Ariane",
      getFreeWeek: "Recevoir la semaine gratuite (PDF)",
      seeSessions: "Voir les séances",
      readGuide: "Lire le guide",
      myProgram: "Mon programme",
      freeKicker: "Gratuit · PDF imprimable",
      freeTitle: "Recevez ces 5 séances en PDF.",
      freeText: "Le PDF de 8 pages, avec un encadré pour noter vos maximums et une page de notes par séance.",
      freeButton: "Recevoir la semaine gratuite",
      programKicker: "Programme ATHX PREP",
      programTitle: "Préparez chaque zone avec un plan calculé sur vos PR.",
      programText: "12 semaines de force, d'endurance et de simulations Metcon X, adaptées à votre catégorie.",
      accessProgram: "Accéder à mon programme",
      notDecided: "Pas encore décidé ?",
      tryFree: "Testez une semaine gratuite en PDF",
      readPage: "Lire la page",
      otherPages: "Autres pages",
      seeAlso: "À voir aussi",
    };

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
  if (children.length > 0) toc.push({ id: "pages-du-guide", text: COPY.guidePages, level: 2 });
  if (faq.length > 0) toc.push({ id: "faq", text: UI.faq, level: 2 });
  // Lead-magnet pages (free week): the main call to action is the free PDF, not the paid program.
  const leadMagnet = Boolean(guide.newsletter);
  const pdfForm = { title: COPY.pdfTitle, text: COPY.pdfText, button: COPY.pdfButton };
  const path = guidePath(guide);
  const url = `${site.url}${path}`;
  const crumbs = [
    { name: UI.home, path: "" },
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
              inLanguage: UI.inLanguage,
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
          <div className="hero-bg">
            <Image src={guide.heroImage} alt={guide.heroImageAlt ?? ""} fill priority sizes="(max-width: 860px) 100vw, 52vw" />
          </div>
        )}
        <div className="wrap hero-grid">
          <div>
            <nav className="breadcrumb" aria-label={COPY.breadcrumb}>
              <ol>
                <li>
                  <Link href="/">{UI.home}</Link>
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
              {leadMagnet ? (
                <>
                  <a href="#recevoir-le-pdf" className="btn btn-signal">
                    {COPY.getFreeWeek}
                  </a>
                  <a href="#contenu" className="btn btn-ghost">
                    {COPY.seeSessions}
                  </a>
                </>
              ) : (
                <>
                  <a href="#contenu" className="btn btn-ghost">
                    {COPY.readGuide}
                  </a>
                  <Link href="/#cta" className="btn btn-signal">
                    {COPY.myProgram} — {priceLabel}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="contenu">
        <div className="wrap">
          {guide.summary && <KeyTakeaways summary={guide.summary} />}
          {toc.length > 1 && <TableOfContents toc={toc} />}
          {leadMagnet && <NewsletterForm id="recevoir-le-pdf" source={guide.slug} {...pdfForm} />}
          <div className="prose" dangerouslySetInnerHTML={{ __html: firstHalf }} />
          {secondHalf && (
            <>
              {leadMagnet ? (
                <aside className="event-cta">
                  <div className="event-cta-body">
                    <div className="kicker">{COPY.freeKicker}</div>
                    <h2>{COPY.freeTitle}</h2>
                    <p>{COPY.freeText}</p>
                    <a href="#recevoir-le-pdf" className="btn btn-signal">
                      {COPY.freeButton}
                    </a>
                  </div>
                </aside>
              ) : (
                <aside className="event-cta">
                  <div className="event-cta-body">
                    <div className="kicker">{COPY.programKicker}</div>
                    <h2>{COPY.programTitle}</h2>
                    <p>{COPY.programText}</p>
                    <Link href="/#cta" className="btn btn-signal">
                      {COPY.accessProgram} — {priceLabel}
                    </Link>
                    <p className="free-link">
                      {COPY.notDecided} <Link href={localPath("/semaine-athx-gratuite")}>{COPY.tryFree}</Link>
                    </p>
                  </div>
                </aside>
              )}
              <div className="prose" dangerouslySetInnerHTML={{ __html: secondHalf }} />
            </>
          )}

          {children.length > 0 && (
            <nav className="guide-children" aria-labelledby="pages-du-guide">
              <h2 id="pages-du-guide" className="h-sec h-small">
                {COPY.guidePages}
              </h2>
              <div className="event-others-grid guide-children-grid">
                {children.map((child) => (
                  <Link key={child.slug} href={guidePath(child)} className="event-other">
                    {child.kicker && <span className="post-tag">{child.kicker}</span>}
                    <strong>{child.menuLabel}</strong>
                    <span className="event-venue">{child.excerpt}</span>
                    <span className="post-read">{COPY.readPage}</span>
                  </Link>
                ))}
              </div>
            </nav>
          )}

          {faq.length > 0 && <ArticleFaq faq={faq} />}
          {leadMagnet ? (
            <NewsletterForm id="recevoir-le-pdf-fin" source={`${guide.slug}-fin`} {...pdfForm} />
          ) : (
            <NewsletterForm source={guide.slug} />
          )}
        </div>
      </section>

      <section className="last">
        <div className="wrap">
          <AuthorBox about={about} />
          {siblings.length > 0 && hub && (
            <nav className="event-others" aria-label={`${COPY.otherPages}${isEn ? ":" : " :"} ${hub.menuLabel}`}>
              <h2 className="h-sec h-small">
                {COPY.seeAlso}
                {isEn ? ":" : " :"} {hub.menuLabel}
              </h2>
              <div className="event-others-grid">
                {siblings.map((other) => (
                  <Link key={other.slug} href={guidePath(other)} className="event-other">
                    {other.kicker && <span className="post-tag">{other.kicker}</span>}
                    <strong>{other.menuLabel}</strong>
                    <span className="post-read">{COPY.readPage}</span>
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
