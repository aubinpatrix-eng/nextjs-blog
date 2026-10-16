import JsonLd from "@/app/_components/json-ld";
import PostCard from "@/app/_components/post-card";
import PrCalculator from "@/app/_components/pr-calculator";
import Proof from "@/app/_components/proof";
import { getAllPosts } from "@/lib/api";
import { getAllEvents } from "@/lib/events";
import { isEn, languageAlternates, UI } from "@/lib/i18n";
import { localPath } from "@/lib/paths";
import { organizationId, faqSchema, personId, personSchema } from "@/lib/schema";
import { formatPrice, getAbout, getHome, getSite } from "@/lib/site";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { alternates: languageAlternates({ fr: "/", en: "/" }) };

const COPY = isEn
  ? {
      courseName: "ATHX training program — 12 weeks",
      level: "All levels (Lite, ATHX and Pro categories)",
      about: ["ATHX Games", "Strength and conditioning", "Strength training", "Hybrid fitness"],
      getProgram: "Get my program",
      tryFree: "Try 1 free week",
      statsLabel: "ATHX in numbers",
      freeKicker: "Free · Printable PDF",
      freeTitle: ["Try one week", "of the program"],
      freeLede:
        "5 sessions taken from week 1: 4 strength sessions with SkiErg and rowing finishers, and an ATHX Metcon. Loads as a % of your PRs, ready to start this week.",
      freeItems: ["The 8-page PDF, ready to print", "Sets, rest and coaching cues for every session", "No commitment, unsubscribe in one click"],
      freeButton: "Get the free week",
      seeProgram: "See my program →",
      zonesMore: ["Reps, loads by category and scoring: see the guide to the", "ATHX 2027 workouts", "the", "ATHX categories", "and the", "free training week"],
      nextTitle: ["Upcoming", "competitions"],
      nextLede: "Three ATHX events in France in 2027. For each one: the workouts, the dates and a week-by-week training plan.",
      prep: (city: string) => `ATHX ${city} prep →`,
      latest: "Latest articles",
      allPosts: "All articles",
    }
  : {
      courseName: "Programme de préparation ATHX — 12 semaines",
      level: "Tous niveaux (catégories Lite, ATHX et Pro)",
      about: ["ATHX Games", "Préparation physique", "Musculation", "Fitness hybride"],
      getProgram: "Obtenir mon programme",
      tryFree: "Tester 1 semaine gratuite",
      statsLabel: "L'ATHX en chiffres",
      freeKicker: "Gratuit · PDF imprimable",
      freeTitle: ["Testez une semaine", "du programme"],
      freeLede:
        "5 séances extraites de la semaine 1 : 4 séances de force avec finishers au SkiErg et au rameur, et un Metcon ATHX. Charges en % de vos PR, à faire dès cette semaine.",
      freeItems: ["Le PDF de 8 pages, prêt à imprimer", "Séries, repos et consignes pour chaque séance", "Sans engagement, désinscription en un clic"],
      freeButton: "Recevoir la semaine gratuite",
      seeProgram: "Voir mon programme →",
      zonesMore: ["Répétitions, charges par catégorie et scoring : voir le guide", "des workouts ATHX 2027", "les", "catégories ATHX", "et la", "semaine d'entraînement gratuite"],
      nextTitle: ["Prochaines", "compétitions"],
      nextLede: "Trois étapes ATHX en France en 2027. Pour chacune : les épreuves, les dates et un plan de préparation semaine par semaine.",
      prep: (city: string) => `Prépa ATHX ${city} →`,
      latest: "Derniers articles",
      allPosts: "Tous les articles",
    };

export default function Index() {
  const site = getSite();
  const home = getHome();
  const about = getAbout();
  const weeklyMinutes = (site.sessionsPerWeek || 0) * (site.sessionMinutes || 0);
  const workloadMinutes = 12 * weeklyMinutes;
  const latestPosts = getAllPosts().slice(0, 3);
  const events = getAllEvents();
  const priceLabel = formatPrice(site.price);
  const freeWeek = localPath("/semaine-athx-gratuite");

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": organizationId(site),
              name: site.name,
              url: site.url,
              logo: `${site.url}/icon.png`,
              founder: { "@id": personId(site) },
              ...(site.instagram && { sameAs: [site.instagram] }),
            },
            personSchema(site, about),
            {
              "@type": "WebSite",
              name: site.name,
              url: site.url,
              inLanguage: UI.inLanguage,
              publisher: { "@id": organizationId(site) },
            },
            {
              "@type": "Course",
              "@id": `${site.url}/#course`,
              name: COPY.courseName,
              description: `${home.hero.lede} ${home.program.lede}`,
              url: site.url,
              // The program itself is written in French, on both sites.
              inLanguage: "fr-FR",
              provider: { "@id": organizationId(site) },
              creator: { "@id": personId(site) },
              educationalLevel: COPY.level,
              teaches: home.program.blocks.map((block) => block.title),
              about: COPY.about,
              image: `${site.url}${about.photo}`,
              offers: {
                "@type": "Offer",
                category: "Paid",
                price: site.price.toFixed(2),
                priceCurrency: "EUR",
                availability: "https://schema.org/InStock",
                url: `${site.url}/#cta`,
              },
              hasCourseInstance: {
                "@type": "CourseInstance",
                courseMode: "Online",
                ...(workloadMinutes > 0 && {
                  // Total workload over the 12 weeks, from the settings in Pages CMS.
                  courseWorkload: `PT${workloadMinutes}M`,
                  courseSchedule: {
                    "@type": "Schedule",
                    duration: `PT${weeklyMinutes}M`,
                    repeatFrequency: "Weekly",
                    repeatCount: 12,
                  },
                }),
                instructor: { "@id": personId(site) },
                inLanguage: "fr-FR",
              },
            },
            faqSchema(home.faq),
          ],
        }}
      />

      <section className={`hero${home.hero.image ? " hero-photo" : ""}`} id="home">
        {home.hero.image && (
          <div className="hero-bg">
            <Image src={home.hero.image} alt={home.hero.imageAlt ?? ""} fill priority sizes="(max-width: 860px) 100vw, 52vw" />
          </div>
        )}
        <div className="wrap hero-grid">
          <div>
            <div className="kicker">{home.hero.kicker}</div>
            <h1 className="h-hero pre-line">{home.hero.title}</h1>
            <p className="lede">{home.hero.lede}</p>
            <ul className="hero-features">
              {home.hero.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="hero-ctas">
              <a href="#cta" className="btn btn-signal">
                {COPY.getProgram}
              </a>
              <Link href={freeWeek} className="btn btn-ghost">
                {COPY.tryFree}
              </Link>
            </div>
          </div>
          <div className="hero-card price-badge">
            <div className="price">{priceLabel}</div>
            <p className="note">{home.hero.offerNote}</p>
          </div>
        </div>
      </section>

      <section className="stat-strip" aria-label={COPY.statsLabel}>
        <div className="wrap">
          {home.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <div className="num">{stat.value}</div>
              <p>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="free-band" aria-labelledby="semaine-gratuite">
        <div className="wrap free-band-grid">
          <div>
            <div className="kicker">{COPY.freeKicker}</div>
            <h2 className="h-sec" id="semaine-gratuite">
              {COPY.freeTitle[0]}
              <br />
              {COPY.freeTitle[1]}
            </h2>
            <p className="lede">{COPY.freeLede}</p>
          </div>
          <div className="free-band-cta">
            <ul>
              {COPY.freeItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href={freeWeek} className="btn btn-signal">
              {COPY.freeButton}
            </Link>
          </div>
        </div>
      </section>

      <Proof />

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
                  <img src={persona.image} alt={persona.imageAlt ?? ""} loading="lazy" width={800} height={1067} />
                  <div className="persona-body">
                    <div className="post-tag">{persona.label}</div>
                    <h3>{persona.title}</h3>
                    <p>{persona.text}</p>
                    <span className="persona-cta">{COPY.seeProgram}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

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
          <p className="zones-more">
            {COPY.zonesMore[0]} <Link href={localPath("/workouts-athx-2027")}>{COPY.zonesMore[1]}</Link>,{" "}
            {COPY.zonesMore[2]} <Link href={localPath("/categories-athx")}>{COPY.zonesMore[3]}</Link>{" "}
            {COPY.zonesMore[4]} <Link href={freeWeek}>{COPY.zonesMore[5]}</Link>.
          </p>
        </div>
      </section>

      {events.length > 0 && (
        <section id="competitions">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec">
                {COPY.nextTitle[0]}
                <br />
                {COPY.nextTitle[1]}
              </h2>
              <p className="lede">{COPY.nextLede}</p>
            </div>
            <div className="event-others-grid events-home">
              {events.map((event) => (
                <Link key={event.slug} href={`/${event.slug}`} className="event-other">
                  <span className="post-tag">{event.dates}</span>
                  <strong>ATHX {event.city}</strong>
                  <span className="event-venue">{event.venue}</span>
                  <span className="post-read">{COPY.prep(event.city)}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
            {UI.faq}
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
              <h2 className="h-sec">{COPY.latest}</h2>
              <Link href="/blog" className="post-read">
                {COPY.allPosts}
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

      <section className={`last${home.finalImage ? " final-band" : ""}`}>
        {home.finalImage && (
          <Image className="final-bg" src={home.finalImage} alt={home.finalImageAlt ?? ""} fill sizes="100vw" />
        )}
        <div className="wrap center">
          <h2 className="h-sec">{home.finalCta}</h2>
          <a href="#cta" className="btn btn-signal">
            {COPY.getProgram} — {priceLabel}
          </a>
        </div>
      </section>
    </main>
  );
}
