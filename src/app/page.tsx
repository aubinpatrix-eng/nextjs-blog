import JsonLd from "@/app/_components/json-ld";
import PostCard from "@/app/_components/post-card";
import PrCalculator from "@/app/_components/pr-calculator";
import Proof from "@/app/_components/proof";
import { getAllPosts } from "@/lib/api";
import { getAllEvents } from "@/lib/events";
import { organizationId, faqSchema, personId, personSchema } from "@/lib/schema";
import { formatPrice, getAbout, getHome, getSite } from "@/lib/site";
import Link from "next/link";

export default function Index() {
  const site = getSite();
  const home = getHome();
  const about = getAbout();
  const weeklyMinutes = (site.sessionsPerWeek || 0) * (site.sessionMinutes || 0);
  const workloadMinutes = 12 * weeklyMinutes;
  const latestPosts = getAllPosts().slice(0, 3);
  const events = getAllEvents();
  const priceLabel = formatPrice(site.price);

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
              logo: `${site.url}/icon.svg`,
              founder: { "@id": personId(site) },
              ...(site.instagram && { sameAs: [site.instagram] }),
            },
            personSchema(site, about),
            {
              "@type": "WebSite",
              name: site.name,
              url: site.url,
              inLanguage: "fr-FR",
              publisher: { "@id": organizationId(site) },
            },
            {
              "@type": "Course",
              "@id": `${site.url}/#course`,
              name: "Programme de préparation ATHX — 12 semaines",
              description: `${home.hero.lede} ${home.program.lede}`,
              url: site.url,
              inLanguage: "fr-FR",
              provider: { "@id": organizationId(site) },
              creator: { "@id": personId(site) },
              educationalLevel: "Tous niveaux (catégories Lite, ATHX et Pro)",
              teaches: home.program.blocks.map((block) => block.title),
              about: ["ATHX Games", "Préparation physique", "Musculation", "Fitness hybride"],
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
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero-bg" src={home.hero.image} alt={home.hero.imageAlt ?? ""} fetchPriority="high" />
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
                Obtenir mon programme
              </a>
              <a href="#format" className="btn btn-ghost">
                Voir le format ATHX
              </a>
            </div>
          </div>
          <div className="hero-card price-badge">
            <div className="price">{priceLabel}</div>
            <p className="note">{home.hero.offerNote}</p>
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

      {events.length > 0 && (
        <section id="competitions">
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec">
                Prochaines
                <br />
                compétitions
              </h2>
              <p className="lede">
                Trois étapes ATHX en France en 2027. Pour chacune : les épreuves, les dates et un plan de préparation
                semaine par semaine.
              </p>
            </div>
            <div className="event-others-grid events-home">
              {events.map((event) => (
                <Link key={event.slug} href={`/${event.slug}`} className="event-other">
                  <span className="post-tag">{event.dates}</span>
                  <strong>ATHX {event.city}</strong>
                  <span className="event-venue">{event.venue}</span>
                  <span className="post-read">Prépa ATHX {event.city} →</span>
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

      <section className={`last${home.finalImage ? " final-band" : ""}`}>
        {home.finalImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="final-bg" src={home.finalImage} alt="" loading="lazy" />
        )}
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
