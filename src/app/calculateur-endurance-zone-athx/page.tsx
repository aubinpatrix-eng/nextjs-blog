import EnduranceCalculator from "@/app/_components/endurance-calculator";
import JsonLd from "@/app/_components/json-ld";
import { endurancePlan, formatMetres, formatTime } from "@/lib/endurance";
import { href, isEn, staticAlternates, UI } from "@/lib/i18n";
import { localPath } from "@/lib/paths";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { formatPrice, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

const RUN_PACES = [240, 270, 300, 330, 360];
const SKI_PACES = [110, 120, 130, 140, 150];
const TRANSITION = 20;

const COPY = isEn
  ? {
      title: "ATHX 2027 Endurance zone calculator",
      name: "ATHX Endurance zone calculator",
      shortName: "Endurance zone calculator",
      description:
        "Calculate how many SkiErg metres you'll cover in the ATHX 2027 Endurance zone after your 3 km run, within the 24-minute cap, based on your paces.",
      kicker: "Free tool · 2027 season",
      faq: [
        {
          question: "How is the SkiErg distance calculated?",
          answer:
            "The calculator subtracts your running time (distance × pace) and transition time from 24 minutes, then converts the time left into metres using your SkiErg pace per 500 m.",
        },
        {
          question: "What is the run distance in the ATHX 2027 Endurance zone?",
          answer:
            "3 km for the ATHX and Pro categories in the individual format. In Lite, the distance is shorter: check it in the official workouts for your event and enter it in the calculator.",
        },
        {
          question: "Is it better to run fast or save energy for the SkiErg?",
          answer:
            "Every minute saved on the run gives you an extra minute on the SkiErg, roughly 200 to 250 m. But running too fast makes your ski pace drop. Aim for a running pace you could hold for 30 to 40 minutes.",
        },
        {
          question: "Which SkiErg pace should I enter?",
          answer:
            "Take the pace per 500 m you can hold for a 10-minute block in training, then add 5 to 10 seconds: you'll reach the SkiErg after the Strength zone and a 3 km run.",
        },
      ],
      tableTitle: ["Your SkiErg metres", "by pace"],
      tableLede: `SkiErg distance after a 3 km run, with ${TRANSITION} seconds of transition and a 24-minute cap. Rows: your running pace; columns: your SkiErg pace per 500 m.`,
      runHeader: "Run (3 km)",
      ctaTitle: "More metres on race day.",
      ctaText: (price: string) =>
        `12 weeks of ATHX training: strength, running, SkiErg and transitions. One-off payment of ${price}. Program written in French.`,
      cta: "Get my program",
    }
  : {
      title: "Calculateur Endurance zone ATHX 2027",
      name: "Calculateur Endurance zone ATHX",
      shortName: "Calculateur Endurance zone",
      description:
        "Calculez combien de mètres de SkiErg vous ferez à l'Endurance zone ATHX 2027 après vos 3 km de course, dans la limite de 24 minutes, selon vos allures.",
      kicker: "Outil gratuit · Saison 2027",
      faq: [
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
      ],
      tableTitle: ["Vos mètres de SkiErg", "selon vos allures"],
      tableLede: `Distance au SkiErg après 3 km de course, avec ${TRANSITION} secondes de transition et une limite de 24 minutes. En ligne, votre allure de course ; en colonne, votre allure SkiErg au 500 m.`,
      runHeader: "Course (3 km)",
      ctaTitle: "Plus de mètres le jour J.",
      ctaText: (price: string) =>
        `12 semaines de préparation ATHX : force, course, SkiErg et enchaînements. Paiement unique de ${price}.`,
      cta: "Obtenir mon programme",
    };

const description = COPY.description;
const faq = COPY.faq;

export const metadata: Metadata = {
  title: COPY.title,
  description,
  alternates: staticAlternates("/calculateur-endurance-zone-athx"),
};

function Strategy() {
  const enduranceGuide = localPath("/workouts-athx-2027/endurance-zone");
  const skierg = localPath("/mouvements-athx/skierg");
  const oneRm = href("/calculateur-1rm");
  if (isEn) {
    return (
      <>
        <h2>How to use the result</h2>
        <p>
          The 2027 Endurance zone has two parts: a fixed-distance run, then as many SkiErg metres as possible in the time
          left. Your score is the SkiErg distance. The calculator shows the balance between the two:{" "}
          <strong>running 10 seconds per km faster gives you 30 more seconds of skiing</strong>, about a hundred metres,
          as long as you keep your SkiErg pace.
        </p>
        <ul>
          <li>
            <strong>Set a realistic running pace</strong>: one you could hold for 30 to 40 minutes. Your legs are coming
            out of the Strength zone.
          </li>
          <li>
            <strong>Nail the transition</strong>: 20 seconds lost is 60 to 90 m less on the SkiErg.
          </li>
          <li>
            <strong>Train the combination</strong>: a 3 km run followed by 10 to 15 minutes of SkiErg, every one to two
            weeks.
          </li>
        </ul>
        <p>
          The full format and strategy are in the guide to the <Link href={enduranceGuide}>ATHX 2027 Endurance zone</Link>,
          and the technique in <Link href={skierg}>the SkiErg: technique and pacing</Link>. For the strength part, use the{" "}
          <Link href={oneRm}>1RM calculator</Link>.
        </p>
      </>
    );
  }
  return (
    <>
      <h2>Comment utiliser le résultat</h2>
      <p>
        L&apos;Endurance zone 2027 se joue en deux temps : une course de distance fixe, puis le maximum de mètres au
        SkiErg dans le temps restant. Le score est la distance au SkiErg. Le calculateur montre l&apos;équilibre entre les
        deux : <strong>courir 10 secondes plus vite au kilomètre vous donne 30 secondes de ski en plus</strong>, soit une
        centaine de mètres, à condition de garder votre allure au SkiErg.
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
          <strong>Entraînez l&apos;enchaînement</strong> : 3 km de course suivis de 10 à 15 minutes de SkiErg, toutes les
          une à deux semaines.
        </li>
      </ul>
      <p>
        Le format complet et la stratégie sont détaillés dans le guide de{" "}
        <Link href={enduranceGuide}>l&apos;Endurance zone ATHX 2027</Link>, et la technique dans{" "}
        <Link href={skierg}>le SkiErg : technique et allures</Link>. Pour la partie force, utilisez le{" "}
        <Link href={oneRm}>calculateur 1RM</Link>.
      </p>
    </>
  );
}

export default function EnduranceCalculatorPage() {
  const site = getSite();
  const path = href("/calculateur-endurance-zone-athx");

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
            breadcrumbSchema(site, [{ name: UI.home, path: "" }, { name: COPY.shortName }]),
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
          <EnduranceCalculator />
        </div>
      </section>

      <section id="reperes">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h-sec">
              {COPY.tableTitle[0]}
              <br />
              {COPY.tableTitle[1]}
            </h2>
            <p className="lede">{COPY.tableLede}</p>
          </div>
          <div className="prose">
            <div className="table-wrap table-stack">
              <table>
                <thead>
                  <tr>
                    <th>{COPY.runHeader}</th>
                    {SKI_PACES.map((ski) => (
                      <th key={ski}>SkiErg {formatTime(ski)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RUN_PACES.map((run) => (
                    <tr key={run}>
                      <td data-label={COPY.runHeader}>
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
          <Strategy />
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
