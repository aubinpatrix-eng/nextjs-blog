import { TableOfContents } from "@/app/_components/article-blocks";
import JsonLd from "@/app/_components/json-ld";
import LiftCalculators from "@/app/_components/lift-calculators";
import OneRmCalculator from "@/app/_components/one-rm-calculator";
import { href, isEn, LOCALE, staticAlternates, UI } from "@/lib/i18n";
import { markdownToHtmlWithToc } from "@/lib/markdownToHtml";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";
import { formatPrice, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

const COPY = isEn
  ? {
      title: "Free 1RM calculator (2RM, 3RM, % of max)",
      name: "1RM calculator",
      description:
        "Calculate your 1RM (one-rep max) for free from a set of 2 to 10 reps, with your 2RM, 3RM and training loads as a percentage.",
      kicker: "Free tool",
      faq: [
        {
          question: "What is a 1RM?",
          answer:
            "Your 1RM (one-rep max) is the heaviest load you can lift once with correct technique. It is the reference used to calculate training loads as a percentage.",
        },
        {
          question: "How is the 1RM calculated?",
          answer:
            "The calculator averages two well-known formulas, Epley and Brzycki, based on the weight and the number of reps completed. The estimate is most reliable between 2 and 6 reps.",
        },
        {
          question: "Why know your 2RM and 3RM for ATHX?",
          answer:
            "In the 2027 season, the ATHX Strength zone tests a 1RM shoulder-to-overhead, a 2RM back squat and a 3RM deadlift. Knowing these loads helps you choose your attempts on the day.",
        },
        {
          question: "Should you test a true 1RM?",
          answer:
            "Not necessarily. An estimate from a set of 3 to 5 reps is safer and enough to plan your training. If you test a true max, do it with a progressive warm-up and a spotter.",
        },
      ],
      liftsTitle: ["Your 3 strength", "lifts"],
      liftsLede:
        "Calculate your 1RM for the squat, deadlift and overhead press, and estimate your score in the ATHX 2027 Strength zone (2RM squat, 3RM deadlift, 1RM shoulder-to-overhead).",
      ctaTitle: "Your PRs, your program.",
      ctaText: (price: string) => `12 weeks of ATHX training built on your loads. One-off payment of ${price}. Program written in French.`,
      cta: "Get my program",
    }
  : {
      title: "Calculateur 1RM gratuit (2RM, 3RM, % de charge)",
      name: "Calculateur 1RM",
      description:
        "Calculez gratuitement votre 1RM (charge maximale) à partir d'une série de 2 à 10 répétitions, avec vos 2RM, 3RM et vos charges d'entraînement en pourcentage.",
      kicker: "Outil gratuit",
      faq: [
        {
          question: "Qu'est-ce que le 1RM ?",
          answer:
            "Le 1RM (one-rep max) est la charge maximale que vous pouvez soulever une seule fois, avec une technique correcte. C'est la référence utilisée pour calculer les charges d'entraînement en pourcentage.",
        },
        {
          question: "Comment le 1RM est-il calculé ?",
          answer:
            "Le calculateur fait la moyenne de deux formules reconnues, Epley et Brzycki, à partir de la charge et du nombre de répétitions réalisées. L'estimation est la plus fiable entre 2 et 6 répétitions.",
        },
        {
          question: "Pourquoi connaître son 2RM et son 3RM pour l'ATHX ?",
          answer:
            "En saison 2027, la Strength zone de l'ATHX se joue sur un 1RM shoulder-to-overhead, un 2RM squat arrière et un 3RM soulevé de terre. Connaître ces charges vous aide à choisir vos tentatives le jour J.",
        },
        {
          question: "Faut-il tester son 1RM réel ?",
          answer:
            "Pas forcément. Une estimation à partir d'une série de 3 à 5 répétitions est plus sûre et suffit pour programmer son entraînement. Si vous testez un vrai maximum, faites-le avec un échauffement progressif et une assistance.",
        },
      ],
      liftsTitle: ["Vos 3 mouvements", "de force"],
      liftsLede:
        "Calculez votre 1RM au squat, au soulevé de terre et au développé militaire, et estimez votre score à la Strength zone de l'ATHX 2027 (2RM squat, 3RM soulevé de terre, 1RM shoulder-to-overhead).",
      ctaTitle: "Vos PR, votre programme.",
      ctaText: (price: string) => `12 semaines de préparation ATHX calculées sur vos charges. Paiement unique de ${price}.`,
      cta: "Obtenir mon programme",
    };

const description = COPY.description;
const faq = COPY.faq;

export const metadata: Metadata = {
  title: COPY.title,
  description,
  alternates: staticAlternates("/calculateur-1rm"),
};

// The guide below the FAQ is editable in Pages CMS (_data/guide-1rm.md, English: _data/en/guide-1rm.md).
async function getGuide() {
  const file = LOCALE === "fr" ? join(process.cwd(), "_data", "guide-1rm.md") : join(process.cwd(), "_data", LOCALE, "guide-1rm.md");
  const { content } = matter(fs.readFileSync(file, "utf8"));
  const { content: html, toc } = await markdownToHtmlWithToc(content);
  // Split the guide's intro (H2 + first paragraph) from its sections so the table of contents sits in between.
  const firstSection = html.indexOf("<h3");
  return {
    guideIntro: firstSection > 0 ? html.slice(0, firstSection) : "",
    guideBody: firstSection > 0 ? html.slice(firstSection) : html,
    // Sections are H3 under the guide's H2: show them as top-level entries in the table of contents.
    guideToc: toc
      .filter((entry) => entry.level > 2)
      .map((entry) => ({ ...entry, level: (entry.level - 1) as 2 | 3 })),
  };
}

export default async function OneRmPage() {
  const site = getSite();
  const { guideIntro, guideBody, guideToc } = await getGuide();
  const path = href("/calculateur-1rm");

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: COPY.name,
              url: `${site.url}${path}`,
              description,
              applicationCategory: "HealthApplication",
              operatingSystem: isEn ? "All" : "Tous",
              inLanguage: UI.inLanguage,
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            },
            faqSchema(faq),
            breadcrumbSchema(site, [{ name: UI.home, path: "" }, { name: COPY.name }]),
          ],
        }}
      />

      <section className="page-hero" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="kicker">{COPY.kicker}</div>
          <h1 className="h-page">{COPY.name}</h1>
          <p className="lede">{description}</p>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap">
          <OneRmCalculator />
        </div>
      </section>

      <section id="mouvements">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec">
              {COPY.liftsTitle[0]}
              <br />
              {COPY.liftsTitle[1]}
            </h2>
            <p className="lede">{COPY.liftsLede}</p>
          </div>
          <LiftCalculators />
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <h2 className="h-sec" style={{ marginBottom: 40 }}>
            {UI.faq}
          </h2>
          {faq.map((item, index) => (
            <details className="faq-item" key={item.question} open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="guide">
        <div className="wrap">
          <div className="prose guide-intro" dangerouslySetInnerHTML={{ __html: guideIntro }} />
          {guideToc.length > 1 && <TableOfContents toc={guideToc} headingLevel={3} />}
          <div className="prose" dangerouslySetInnerHTML={{ __html: guideBody }} />
        </div>
      </section>

      <section className="last">
        <div className="wrap center">
          <h2 className="h-sec">{COPY.ctaTitle}</h2>
          <p className="mute" style={{ margin: "14px auto 0" }}>
            {COPY.ctaText(formatPrice(site.price))}
          </p>
          <Link href="/#cta" className="btn btn-signal">
            {COPY.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
