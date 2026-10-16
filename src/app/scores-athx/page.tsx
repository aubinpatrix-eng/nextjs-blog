import JsonLd from "@/app/_components/json-ld";
import { href, isEn, staticAlternates, UI } from "@/lib/i18n";
import { localPath } from "@/lib/paths";
import { breadcrumbSchema, faqSchema, organizationId } from "@/lib/schema";
import { formatScore, getScoreTable, SEASON_2026, type Zone } from "@/lib/scores";
import { formatPrice, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

const path = href("/scores-athx");

const COPY = isEn
  ? {
      title: "ATHX 2026 results: scores and rankings",
      h1: "ATHX 2026 results: scores by level",
      description:
        "ATHX 2026 results in Paris and Marseille: loads, distances and times for the top 10%, the top 25% and the middle of the field, for women and men.",
      zones: { strength: "total load", endurance: "distance in 22 min", metcon: "time" },
      faq: [
        {
          question: "What is the average score at ATHX?",
          answer:
            "In 2026, in France (ATHX category), a woman in the middle of the field totalled about 220 kg in the Strength zone and 3.9 km in the Endurance zone. For men, the middle of the field was around 345 kg in the Strength zone. The tables on this page give every level.",
        },
        {
          question: "How is the ATHX ranking calculated?",
          answer:
            "Each athlete gets a place in each of the three scored zones (Strength, Endurance, Metcon X). The overall ranking adds up those three places: the lowest total wins. Being consistent across all three zones beats shining in just one.",
        },
        {
          question: "Do these scores apply to 2027?",
          answer:
            "Not directly: in 2027, the Strength zone becomes a 1RM shoulder-to-overhead, 2RM squat and 3RM deadlift, and the Endurance zone becomes a 3 km run followed by max SkiErg metres within 24 minutes. The 2026 levels give an idea of the participants' level.",
        },
        {
          question: "Where can I see the full ATHX Paris or Marseille 2026 leaderboard?",
          answer:
            "On the official ATHX Games website, under Leaderboard: choose 2026, the country France, then the event (Paris or Marseille), the division and the category. This page summarises the scores by level.",
        },
        {
          question: "Where does this data come from?",
          answer:
            "From the public ATHX Games leaderboard for the Paris and Marseille 2026 events, individual, ATHX category. No athlete names are used: only scores and places go into the calculation.",
        },
      ],
      datasetName: "ATHX 2026 results in France (Paris and Marseille) by level",
      timeUnit: "time",
      crumb: "ATHX results",
      kicker: "Data · 2026 season · France",
      statsLabel: "ATHX 2026 scores in numbers",
      ranked: (label: string) => `${label.toLowerCase()} ranked in the individual ATHX category`,
      events: "events in France: Paris (April) and Marseille (September 2026)",
      zonesStat: "scored zones: Strength, Endurance and Metcon X",
      tableTitle: (label: string) => `ATHX 2026 scores: ${label.toLowerCase()}`,
      tableLede: (athletes: number, label: string) =>
        `What it took in each zone to reach each level, out of ${athletes} ${label.toLowerCase()} in the individual ATHX category, in Paris and Marseille.`,
      level: "Level",
      place: (rank: number) => <>(≈ place {rank})</>,
      best: "Best performance",
      missing:
        "— : not enough results at this level of the leaderboard to give a reliable figure. This value will be added once the data is complete.",
      ctaTitle: "Aim for the next level.",
      ctaText: (price: string) => `12 weeks of ATHX training built on your PRs. One-off payment of ${price}. Program written in French.`,
      ctaFree: "Try the free week first",
      cta: "Get my program",
    }
  : {
      title: "Résultats ATHX 2026 : scores et classement",
      h1: "Résultats ATHX 2026 : les scores par niveau",
      description:
        "Résultats ATHX 2026 à Paris et Marseille : charges, distances et temps du top 10 %, du top 25 % et du milieu du classement, chez les femmes et les hommes.",
      zones: { strength: "total des charges", endurance: "distance en 22 min", metcon: "temps" },
      faq: [
        {
          question: "Quel est le score moyen à l'ATHX ?",
          answer:
            "En 2026, en France (catégorie ATHX), une femme au milieu du classement totalisait environ 220 kg en Strength zone et 3,9 km en Endurance zone. Chez les hommes, le milieu du classement se situait autour de 345 kg en Strength zone. Les tableaux de cette page donnent tous les paliers.",
        },
        {
          question: "Comment est calculé le classement de l'ATHX ?",
          answer:
            "Chaque athlète reçoit une place dans chacune des trois zones notées (Strength, Endurance, Metcon X). Le classement général additionne ces trois places : le plus petit total gagne. Être régulier dans les trois zones vaut mieux que briller dans une seule.",
        },
        {
          question: "Ces scores sont-ils valables pour 2027 ?",
          answer:
            "Pas directement : en 2027, la Strength zone passe à 1RM shoulder-to-overhead, 2RM squat et 3RM soulevé de terre, et l'Endurance zone devient 3 km de course puis le maximum de SkiErg en 24 minutes. Les paliers 2026 donnent un ordre de grandeur du niveau des participants.",
        },
        {
          question: "Où voir le classement complet de l'ATHX Paris ou Marseille 2026 ?",
          answer:
            "Sur le site officiel d'ATHX Games, dans la rubrique Leaderboard : choisissez l'année 2026, le pays France, puis l'étape (Paris ou Marseille), la division et la catégorie. Cette page en résume les scores par niveau.",
        },
        {
          question: "D'où viennent ces données ?",
          answer:
            "Du classement public d'ATHX Games pour les étapes de Paris et de Marseille 2026, en individuel, catégorie ATHX. Aucun nom d'athlète n'est repris : seuls les scores et les places servent au calcul.",
        },
      ],
      datasetName: "Résultats ATHX 2026 en France (Paris et Marseille) par niveau",
      timeUnit: "temps",
      crumb: "Scores ATHX",
      kicker: "Données · Saison 2026 · France",
      statsLabel: "Les scores ATHX 2026 en chiffres",
      ranked: (label: string) => `${label.toLowerCase()} classés en individuel (catégorie ATHX)`,
      events: "étapes en France : Paris (avril) et Marseille (septembre 2026)",
      zonesStat: "zones notées : Strength, Endurance et Metcon X",
      tableTitle: (label: string) => `Scores ATHX 2026 : ${label.toLowerCase()}`,
      tableLede: (athletes: number, label: string) =>
        `Ce qu'il fallait réaliser dans chaque zone pour se classer à chaque palier, sur ${athletes} ${label.toLowerCase()} en individuel, catégorie ATHX, à Paris et à Marseille.`,
      level: "Palier",
      place: (rank: number) => (
        <>
          (≈ {rank}
          <sup>e</sup> place)
        </>
      ),
      best: "Meilleure performance",
      missing:
        "— : pas assez de résultats à ce niveau du classement pour donner un chiffre fiable. Cette valeur sera ajoutée dès que les données seront complétées.",
      ctaTitle: "Visez le palier au-dessus.",
      ctaText: (price: string) => `12 semaines de préparation ATHX calculées sur vos PR. Paiement unique de ${price}.`,
      ctaFree: "Testez d'abord la semaine gratuite",
      cta: "Obtenir mon programme",
    };

const description = COPY.description;
const faq = COPY.faq;

export const metadata: Metadata = {
  title: COPY.title,
  description,
  alternates: staticAlternates("/scores-athx"),
};

const ZONES: { zone: Zone; label: string; unit: string }[] = [
  { zone: "strength", label: "Strength zone", unit: COPY.zones.strength },
  { zone: "endurance", label: "Endurance zone", unit: COPY.zones.endurance },
  { zone: "metcon", label: "Metcon X", unit: COPY.zones.metcon },
];

function Analysis() {
  const l = {
    oneRm: href("/calculateur-1rm"),
    strength: localPath("/workouts-athx-2027/strength-zone"),
    about: href("/qui-suis-je"),
    metcon: localPath("/blog/metcon-x-explique"),
    endurance: href("/calculateur-endurance-zone-athx"),
    workouts: localPath("/workouts-athx-2027"),
    categories: localPath("/categories-athx"),
    paris: localPath("/preparation-athx-paris"),
    dates: localPath("/blog/athx-france-dates-2027"),
  };
  if (isEn) {
    return (
      <>
        <h2>What these numbers say</h2>
        <h3>Consistency beats specialism</h3>
        <p>
          The ranking adds up your places in the three scored zones: the lowest total wins. As a result, specialists don&apos;t
          win. Among women, the heaviest Strength zone total (326 kg) finishes <strong>33rd</strong> overall, because it is
          76th in endurance. Among men, it&apos;s even clearer: the best strength total (520 kg) finishes{" "}
          <strong>157th</strong>, and the best endurance score <strong>13th</strong>. The winners are in the top 15 of all
          three zones.
        </p>
        <h3>Strength makes the difference… as long as you hold the rest</h3>
        <p>
          The gap between the top 10% and the middle of the field is about 60 kg for women and over 70 kg for men in the
          Strength zone. It&apos;s the zone where a well-built strength cycle wins you the most places: estimate your loads
          with the <Link href={l.oneRm}>1RM calculator</Link> and read our guide to{" "}
          <Link href={l.strength}>the Strength zone</Link>.
        </p>
        <p>
          For reference: <Link href={l.about}>Aubin Patrix</Link>, the author of this site, totalled <strong>490 kg</strong>{" "}
          in 2026 (70 kg strict press, 200 kg 3RM squat, 220 kg 5RM deadlift): 3rd total across both French events among
          men, and 1st in the Strength zone in Paris.
        </p>
        <h3>Metcon X separates the levels</h3>
        <p>
          The best finish Metcon X in just over 9 minutes, while the back of the field goes past 20 minutes. It&apos;s the
          last test, after two hours of effort: those who managed the previous zones well gain places here. See{" "}
          <Link href={l.metcon}>Metcon X explained</Link>.
        </p>

        <h2>What about 2027?</h2>
        <p>The workouts change in 2027, so these scores don&apos;t carry over as they are:</p>
        <ul>
          <li>
            <strong>Strength zone</strong>: in 2026, 1RM strict press, 3RM back squat and 5RM deadlift. In 2027, 1RM
            shoulder-to-overhead (with leg drive), 2RM squat and 3RM deadlift: fewer reps and a heavier overhead lift, so
            higher totals.
          </li>
          <li>
            <strong>Endurance zone</strong>: in 2026, alternating run and rower for 22 minutes. In 2027, a 3 km run then
            max SkiErg metres within 24 minutes. Estimate your distance with the{" "}
            <Link href={l.endurance}>Endurance zone calculator</Link>.
          </li>
        </ul>
        <p>
          These levels remain the best available benchmark of the participants&apos; level in France. All the details of
          the 2027 format are in our guide to the <Link href={l.workouts}>ATHX 2027 workouts</Link>, and the loads per
          category in <Link href={l.categories}>the ATHX categories</Link>.
        </p>

        <h2>The full Paris and Marseille 2026 leaderboard</h2>
        <p>
          ATHX Paris 2026 took place on 25 April at the Paris Event Center, and ATHX Marseille 2026 in September at the
          Parc Chanot. The official leaderboard of each event, athlete by athlete, is published on the{" "}
          <a href="https://athxgames.com/individual-leaderboards" rel="noopener" target="_blank">
            ATHX Games leaderboard
          </a>
          : choose 2026, the country France, then the event, the division and the category. The tables above summarise
          that leaderboard by level, so you know which score to aim for.
        </p>
        <p>
          Next event: ATHX Paris on 13 and 14 February 2027. See our{" "}
          <Link href={l.paris}>ATHX Paris 2027 preparation guide</Link> and{" "}
          <Link href={l.dates}>all the ATHX 2027 dates in France</Link>.
        </p>

        <h2>Method</h2>
        <p>
          The data comes from the public ATHX Games leaderboard (athxgames.com) for the Paris and Marseille 2026 events,
          individual, ATHX category (the Lite and Pro categories have their own leaderboards). Each result gives a place
          and a score in each zone: the levels are calculated from these place-score pairs, by interpolating between known
          places. Loads are rounded to 5 kg, distances to 10 m and times to 5 seconds. No athlete names appear on this page.
        </p>
        <p>Quoting these figures? Please credit the source with a link to this page.</p>
      </>
    );
  }
  return (
    <>
      <h2>Ce que disent ces chiffres</h2>
      <h3>La régularité bat la spécialité</h3>
      <p>
        Le classement additionne vos places dans les trois zones notées : le plus petit total gagne. Résultat, les
        spécialistes ne gagnent pas. Chez les femmes, la meilleure charge de la Strength zone (326 kg) finit{" "}
        <strong>33<sup>e</sup></strong> au général, car elle est 76<sup>e</sup> en endurance. Chez les hommes, c&apos;est encore
        plus net : le meilleur total en force (520 kg) termine <strong>157<sup>e</sup></strong>, et le meilleur en
        endurance <strong>13<sup>e</sup></strong>. Les vainqueurs, eux, sont dans le top 15 des
        trois zones.
      </p>
      <h3>La force fait la différence… à condition de tenir le reste</h3>
      <p>
        L&apos;écart entre le top 10 % et le milieu du classement est d&apos;environ 60 kg chez les femmes et plus de 70
        kg chez les hommes en Strength zone. C&apos;est la zone où l&apos;on gagne le plus de places avec un cycle de
        force bien construit : estimez vos charges avec le <Link href={l.oneRm}>calculateur 1RM</Link> et
        lisez notre guide de <Link href={l.strength}>la Strength zone</Link>.
      </p>
      <p>
        Pour situer : <Link href={l.about}>Aubin Patrix</Link>, l&apos;auteur de ce site, a totalisé{" "}
        <strong>490 kg</strong> en 2026 (70 kg au développé strict, 200 kg au 3RM squat, 220 kg au 5RM soulevé de
        terre) : 3<sup>e</sup> total des deux étapes françaises chez les hommes, et 1<sup>er</sup> de la Strength zone
        à Paris.
      </p>
      <h3>Le Metcon X sépare les niveaux</h3>
      <p>
        Les meilleurs bouclent le Metcon X en un peu plus de 9 minutes, quand la fin du classement dépasse les 20
        minutes. C&apos;est la dernière épreuve, après deux heures d&apos;effort : ceux qui ont bien géré les zones
        précédentes y gagnent des places. Voir <Link href={l.metcon}>le Metcon X expliqué</Link>.
      </p>

      <h2>Et pour 2027 ?</h2>
      <p>Les workouts changent en 2027, ces scores ne se transposent donc pas tels quels :</p>
      <ul>
        <li>
          <strong>Strength zone</strong> : en 2026, 1RM développé strict, 3RM squat arrière et 5RM soulevé de terre.
          En 2027, 1RM shoulder-to-overhead (avec impulsion des jambes), 2RM squat et 3RM soulevé de terre : moins de
          répétitions et un mouvement au-dessus de la tête plus lourd, donc des totaux plus élevés.
        </li>
        <li>
          <strong>Endurance zone</strong> : en 2026, course et rameur en alternance pendant 22 minutes. En 2027, 3 km
          de course puis le maximum de mètres au SkiErg en 24 minutes. Estimez votre distance avec le{" "}
          <Link href={l.endurance}>calculateur Endurance zone</Link>.
        </li>
      </ul>
      <p>
        Ces paliers restent le meilleur repère disponible sur le niveau des participants en France. Tous les détails
        du format 2027 sont dans notre guide des <Link href={l.workouts}>workouts ATHX 2027</Link>, et les
        charges par catégorie dans <Link href={l.categories}>les catégories ATHX</Link>.
      </p>

      <h2>Le classement complet de Paris et Marseille 2026</h2>
      <p>
        L&apos;ATHX Paris 2026 s&apos;est tenu le 25 avril au Paris Event Center, et l&apos;ATHX Marseille 2026 en
        septembre au Parc Chanot. Le classement officiel de chaque étape, athlète par athlète, est publié sur le{" "}
        <a href="https://athxgames.com/individual-leaderboards" rel="noopener" target="_blank">
          leaderboard d&apos;ATHX Games
        </a>{" "}
        : choisissez l&apos;année 2026, le pays France, puis l&apos;étape, la division et la catégorie. Les tableaux
        ci-dessus résument ce classement par niveau, pour savoir quel score viser.
      </p>
      <p>
        Prochaine étape : l&apos;ATHX Paris les 13 et 14 février 2027. Voir notre{" "}
        <Link href={l.paris}>guide de préparation ATHX Paris 2027</Link> et{" "}
        <Link href={l.dates}>toutes les dates ATHX 2027 en France</Link>.
      </p>

      <h2>Méthode</h2>
      <p>
        Les données viennent du classement public d&apos;ATHX Games (athxgames.com) pour les étapes de Paris et de
        Marseille 2026, en individuel, catégorie ATHX (les catégories Lite et Pro ont leur propre classement). Chaque résultat donne une place et un score
        dans chaque zone : les paliers sont calculés à partir de ces couples place-score, par interpolation entre les
        places connues. Les charges sont arrondies à 5 kg, les distances à 10 m et les temps à 5 secondes. Aucun nom
        d&apos;athlète n&apos;est repris sur cette page.
      </p>
      <p>
        Vous citez ces chiffres ? Merci d&apos;indiquer la source avec un lien vers cette page.
      </p>
    
    </>
  );
}

export default function ScoresPage() {
  const site = getSite();
  const tables = SEASON_2026.map(getScoreTable);

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Dataset",
              name: COPY.datasetName,
              description,
              url: `${site.url}${path}`,
              inLanguage: UI.inLanguage,
              temporalCoverage: "2026",
              spatialCoverage: "France",
              isAccessibleForFree: true,
              creator: { "@id": organizationId(site) },
              variableMeasured: ["Strength zone (kg)", "Endurance zone (km)", `Metcon X (${COPY.timeUnit})`],
            },
            faqSchema(faq),
            breadcrumbSchema(site, [{ name: UI.home, path: "" }, { name: COPY.crumb }]),
          ],
        }}
      />

      <section className="page-hero" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="kicker">{COPY.kicker}</div>
          <h1 className="h-page">{COPY.h1}</h1>
          <p className="lede">{description}</p>
        </div>
      </section>

      <section className="stat-strip" aria-label={COPY.statsLabel}>
        <div className="wrap">
          {tables.map((table) => (
            <div className="stat" key={table.id}>
              <div className="num">{table.athletes}</div>
              <p>{COPY.ranked(table.label)}</p>
            </div>
          ))}
          <div className="stat">
            <div className="num">2</div>
            <p>{COPY.events}</p>
          </div>
          <div className="stat">
            <div className="num">3</div>
            <p>{COPY.zonesStat}</p>
          </div>
        </div>
      </section>

      {tables.map((table) => (
        <section id={table.id} key={table.id}>
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec">{COPY.tableTitle(table.label)}</h2>
              <p className="lede">{COPY.tableLede(table.athletes, table.label)}</p>
            </div>
            <div className="prose">
              <div className="table-wrap table-stack">
                <table>
                  <thead>
                    <tr>
                      <th>{COPY.level}</th>
                      {ZONES.map((z) => (
                        <th key={z.zone}>
                          {z.label} ({z.unit})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.levels.map((level) => (
                      <tr key={level.id}>
                        <td data-label={COPY.level}>
                          <strong>{level.label}</strong> {COPY.place(level.rank)}
                        </td>
                        {ZONES.map((z) => (
                          <td key={z.zone} data-label={z.label}>
                            {formatScore(z.zone, level.values[z.zone])}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {Object.values(table.best).some((value) => value !== null) && (
                      <tr>
                        <td data-label={COPY.level}>
                          <strong>{COPY.best}</strong>
                        </td>
                        {ZONES.map((z) => (
                          <td key={z.zone} data-label={z.label}>
                            {formatScore(z.zone, table.best[z.zone], true)}
                          </td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {table.levels.some((level) => Object.values(level.values).some((value) => value === null)) && (
                <p className="fine">{COPY.missing}</p>
              )}
            </div>
          </div>
        </section>
      ))}

      <section id="lecture">
        <div className="wrap prose">
          <Analysis />
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
            {COPY.ctaText(formatPrice(site.price))} <Link href={localPath("/semaine-athx-gratuite")}>{COPY.ctaFree}</Link>.
          </p>
          <Link href="/#cta" className="btn btn-signal">
            {COPY.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}
