import EnduranceCalculator from "@/app/_components/endurance-calculator";
import JsonLd from "@/app/_components/json-ld";
import { endurancePlan, formatMetres, formatTime } from "@/lib/endurance";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { formatPrice, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

const path = "/calculateur-endurance-zone-athx";
const description =
  "Calculez combien de mètres de SkiErg vous ferez à l'Endurance zone ATHX 2027 après vos 3 km de course, dans la limite de 24 minutes, selon vos allures.";

export const metadata: Metadata = {
  title: "Calculateur Endurance zone ATHX 2027",
  description,
  alternates: { canonical: path },
};

const RUN_PACES = [240, 270, 300, 330, 360];
const SKI_PACES = [110, 120, 130, 140, 150];
const TRANSITION = 20;

const faq = [
  {
    question: "Comment est calculée la distance au SkiErg ?",
    answer:
      "Le calculateur retire des 24 minutes le temps de course (distance × allure) et le temps de transition, puis convertit le temps restant en mètres avec votre allure SkiErg au 500 m.",
  },
  {
    question: "Quelle distance de course à l'Endurance zone ATHX 2027 ?",
    answer:
      "3 km pour les catégories ATHX et Pro en individuel. En Lite, la distance est réduite : vérifiez-la dans les workouts officiels de votre étape et saisissez-la dans le calculateur.",
  },
  {
    question: "Vaut-il mieux courir vite ou garder des forces pour le SkiErg ?",
    answer:
      "Chaque minute gagnée en course donne une minute de SkiErg en plus, soit environ 200 à 250 m. Mais une course trop rapide fait chuter votre allure au ski. Visez une allure de course que vous pourriez tenir 30 à 40 minutes.",
  },
  {
    question: "Quelle allure SkiErg saisir ?",
    answer:
      "Prenez l'allure au 500 m que vous tenez sur un bloc de 10 minutes à l'entraînement, puis ajoutez 5 à 10 secondes : vous arriverez au SkiErg après la Strength zone et 3 km de course.",
  },
];

export default function EnduranceCalculatorPage() {
  const site = getSite();

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebApplication",
              name: "Calculateur Endurance zone ATHX",
              url: `${site.url}${path}`,
              description,
              applicationCategory: "HealthApplication",
              operatingSystem: "Tous",
              inLanguage: "fr-FR",
              offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
            },
            faqSchema(faq),
            breadcrumbSchema(site, [{ name: "Accueil", path: "" }, { name: "Calculateur Endurance zone" }]),
          ],
        }}
      />

      <section className="page-hero" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="kicker">Outil gratuit · Saison 2027</div>
          <h1 className="h-page">Calculateur Endurance zone ATHX</h1>
          <p className="lede">{description}</p>
        </div>
      </section>

      <section className="cta-section">
        <div className="wrap">
          <EnduranceCalculator />
        </div>
      </section>

      <section id="reperes">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec">
              Vos mètres de SkiErg
              <br />
              selon vos allures
            </h2>
            <p className="lede">
              Distance au SkiErg après 3 km de course, avec {TRANSITION} secondes de transition et une limite de 24
              minutes. En ligne, votre allure de course ; en colonne, votre allure SkiErg au 500 m.
            </p>
          </div>
          <div className="prose">
            <div className="table-wrap table-stack">
              <table>
                <thead>
                  <tr>
                    <th>Course (3 km)</th>
                    {SKI_PACES.map((ski) => (
                      <th key={ski}>SkiErg {formatTime(ski)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RUN_PACES.map((run) => (
                    <tr key={run}>
                      <td data-label="Course (3 km)">
                        <strong>{formatTime(run)}/km</strong> ({formatTime(run * 3)})
                      </td>
                      {SKI_PACES.map((ski) => (
                        <td key={ski} data-label={`SkiErg ${formatTime(ski)}/500 m`}>
                          {formatMetres(endurancePlan({ runKm: 3, runPace: run, transition: TRANSITION, skiPace: ski }).skiMetres)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="strategie">
        <div className="wrap prose">
          <h2>Comment utiliser le résultat</h2>
          <p>
            L&apos;Endurance zone 2027 se joue en deux temps : une course de distance fixe, puis le maximum de mètres
            au SkiErg dans le temps restant. Le score est la distance au SkiErg. Le calculateur montre l&apos;équilibre
            entre les deux : <strong>courir 10 secondes plus vite au kilomètre vous donne 30 secondes de ski en plus</strong>,
            soit une centaine de mètres, à condition de garder votre allure au SkiErg.
          </p>
          <ul>
            <li>
              <strong>Fixez une allure de course réaliste</strong> : celle que vous tiendriez 30 à 40 minutes. Les jambes
              sortent de la Strength zone.
            </li>
            <li>
              <strong>Soignez la transition</strong> : 20 secondes perdues, c&apos;est 60 à 90 m de SkiErg en moins.
            </li>
            <li>
              <strong>Entraînez l&apos;enchaînement</strong> : 3 km de course suivis de 10 à 15 minutes de SkiErg, toutes
              les une à deux semaines.
            </li>
          </ul>
          <p>
            Le format complet et la stratégie sont détaillés dans le guide de{" "}
            <Link href="/workouts-athx-2027/endurance-zone">l&apos;Endurance zone ATHX 2027</Link>, et la technique dans{" "}
            <Link href="/mouvements-athx/skierg">le SkiErg : technique et allures</Link>. Pour la partie force, utilisez le{" "}
            <Link href="/calculateur-1rm">calculateur 1RM</Link>.
          </p>
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
          <h2 className="h-sec">Plus de mètres le jour J.</h2>
          <p className="mute" style={{ margin: "14px auto 0" }}>
            12 semaines de préparation ATHX : force, course, SkiErg et enchaînements. Paiement unique de{" "}
            {formatPrice(site.price)}.
          </p>
          <Link href="/#cta" className="btn btn-signal">
            Obtenir mon programme
          </Link>
        </div>
      </section>
    </main>
  );
}
