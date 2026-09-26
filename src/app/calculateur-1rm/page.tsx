import JsonLd from "@/app/_components/json-ld";
import LiftCalculators from "@/app/_components/lift-calculators";
import OneRmCalculator from "@/app/_components/one-rm-calculator";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { formatPrice, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

const description =
  "Calculez gratuitement votre 1RM (charge maximale) à partir d'une série de 2 à 10 répétitions, avec vos 2RM, 3RM et vos charges d'entraînement en pourcentage.";

export const metadata: Metadata = {
  title: "Calculateur 1RM gratuit : estimez votre charge maximale",
  description,
  alternates: { canonical: "/calculateur-1rm" },
};

const faq = [
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
];

export default function OneRmPage() {
  const site = getSite();

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "Calculateur 1RM",
              url: `${site.url}/calculateur-1rm`,
              description,
              applicationCategory: "HealthApplication",
              operatingSystem: "Tous",
              inLanguage: "fr-FR",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            },
            faqSchema(faq),
            breadcrumbSchema(site, [{ name: "Accueil", path: "" }, { name: "Calculateur 1RM" }]),
          ],
        }}
      />

      <section className="page-hero" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="kicker">Outil gratuit</div>
          <h1 className="h-page">Calculateur 1RM</h1>
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
              Vos 3 mouvements
              <br />
              de force
            </h2>
            <p className="lede">
              Calculez votre 1RM au squat, au soulevé de terre et au développé militaire, et estimez votre score à la
              Strength zone de l&apos;ATHX 2027 (2RM squat, 3RM soulevé de terre, 1RM shoulder-to-overhead).
            </p>
          </div>
          <LiftCalculators />
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="prose">
          <h2>Comment utiliser le calculateur</h2>
          <ol>
            <li>Après un échauffement, faites une série lourde de 2 à 6 répétitions avec une technique propre.</li>
            <li>Entrez la charge et le nombre de répétitions réalisées.</li>
            <li>
              Utilisez les pourcentages pour vos séances : autour de 70 à 80 % pour construire la force, 85 à 92 % pour
              vous rapprocher de la compétition.
            </li>
          </ol>
          <p>
            Pour tester vos charges sans risque, lisez notre guide{" "}
            <Link href="/blog/tester-ses-pr-sans-se-blesser">calculer ses PR sans se blesser</Link>. Et pour savoir
            quelles charges viser le jour de la compétition, consultez{" "}
            <Link href="/blog/strength-zone-athx-2027">la Strength zone ATHX 2027 expliquée</Link>.
          </p>
          </div>
        </div>
      </section>

      <section id="faq">
        <div className="wrap">
          <h2 className="h-sec" style={{ marginBottom: 40 }}>
            Questions fréquentes
          </h2>
          {faq.map((item, index) => (
            <details className="faq-item" key={item.question} open={index === 0}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="last">
        <div className="wrap center">
          <h2 className="h-sec">Vos PR, votre programme.</h2>
          <p className="mute" style={{ margin: "14px auto 0" }}>
            12 semaines de préparation ATHX calculées sur vos charges. Paiement unique de {formatPrice(site.price)}.
          </p>
          <Link href="/#cta" className="btn btn-signal">
            Obtenir mon programme
          </Link>
        </div>
      </section>
    </main>
  );
}
