import JsonLd from "@/app/_components/json-ld";
import { breadcrumbSchema, faqSchema, organizationId } from "@/lib/schema";
import { formatScore, getScoreTable, SEASON_2026, type Zone } from "@/lib/scores";
import { formatPrice, getSite } from "@/lib/site";
import { Metadata } from "next";
import Link from "next/link";

const path = "/scores-athx";
const description =
  "Scores ATHX 2026 en France (Paris et Marseille) : charges, distances et temps à viser pour finir dans le top 10 %, le top 25 % ou la première moitié, chez les femmes et les hommes.";

export const metadata: Metadata = {
  title: "Scores ATHX 2026 : les repères par niveau",
  description,
  alternates: { canonical: path },
};

const ZONES: { zone: Zone; label: string; unit: string }[] = [
  { zone: "strength", label: "Strength zone", unit: "total des charges" },
  { zone: "endurance", label: "Endurance zone", unit: "distance en 22 min" },
  { zone: "metcon", label: "Metcon X", unit: "temps" },
];

const faq = [
  {
    question: "Quel est le score moyen à l'ATHX ?",
    answer:
      "En 2026, en France (catégories ATHX et Pro), une femme au milieu du classement totalisait environ 220 kg en Strength zone et 3,9 km en Endurance zone. Chez les hommes, le milieu du classement se situait autour de 345 kg en Strength zone. Les tableaux de cette page donnent tous les paliers.",
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
    question: "D'où viennent ces données ?",
    answer:
      "Du classement public d'ATHX Games pour les étapes de Paris et de Marseille 2026, en individuel, catégories ATHX et Pro. Aucun nom d'athlète n'est repris : seuls les scores et les places servent au calcul.",
  },
];

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
              name: "Scores ATHX 2026 en France par niveau",
              description,
              url: `${site.url}${path}`,
              inLanguage: "fr-FR",
              temporalCoverage: "2026",
              spatialCoverage: "France",
              isAccessibleForFree: true,
              creator: { "@id": organizationId(site) },
              variableMeasured: ["Strength zone (kg)", "Endurance zone (km)", "Metcon X (temps)"],
            },
            faqSchema(faq),
            breadcrumbSchema(site, [{ name: "Accueil", path: "" }, { name: "Scores ATHX" }]),
          ],
        }}
      />

      <section className="page-hero" style={{ borderBottom: "none" }}>
        <div className="wrap">
          <div className="kicker">Données · Saison 2026 · France</div>
          <h1 className="h-page">Scores ATHX : les repères pour situer votre niveau</h1>
          <p className="lede">{description}</p>
        </div>
      </section>

      <section className="stat-strip" aria-label="Les scores ATHX 2026 en chiffres">
        <div className="wrap">
          {tables.map((table) => (
            <div className="stat" key={table.id}>
              <div className="num">{table.athletes}</div>
              <p>{table.label.toLowerCase()} classés en individuel (ATHX et Pro)</p>
            </div>
          ))}
          <div className="stat">
            <div className="num">2</div>
            <p>étapes en France : Paris (avril) et Marseille (septembre 2026)</p>
          </div>
          <div className="stat">
            <div className="num">3</div>
            <p>zones notées : Strength, Endurance et Metcon X</p>
          </div>
        </div>
      </section>

      {tables.map((table) => (
        <section id={table.id} key={table.id}>
          <div className="wrap">
            <div className="sec-head">
              <h2 className="h-sec">Scores ATHX 2026 : {table.label.toLowerCase()}</h2>
              <p className="lede">
                Ce qu&apos;il fallait réaliser dans chaque zone pour se classer à chaque palier, sur {table.athletes}{" "}
                {table.label.toLowerCase()} en individuel, catégories ATHX et Pro, à Paris et à Marseille.
              </p>
            </div>
            <div className="prose">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Palier</th>
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
                        <td>
                          <strong>{level.label}</strong> (≈ {level.rank}
                          <sup>e</sup> place)
                        </td>
                        {ZONES.map((z) => (
                          <td key={z.zone}>{formatScore(z.zone, level.values[z.zone])}</td>
                        ))}
                      </tr>
                    ))}
                    {Object.values(table.best).some((value) => value !== null) && (
                      <tr>
                        <td>
                          <strong>Meilleure performance</strong>
                        </td>
                        {ZONES.map((z) => (
                          <td key={z.zone}>{formatScore(z.zone, table.best[z.zone], true)}</td>
                        ))}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {table.levels.some((level) => Object.values(level.values).some((value) => value === null)) && (
                <p className="fine">
                  — : pas assez de résultats à ce niveau du classement pour donner un chiffre fiable. Cette valeur sera
                  ajoutée dès que les données seront complétées.
                </p>
              )}
            </div>
          </div>
        </section>
      ))}

      <section id="lecture">
        <div className="wrap prose">
          <h2>Ce que disent ces chiffres</h2>
          <h3>La régularité bat la spécialité</h3>
          <p>
            Le classement additionne vos places dans les trois zones notées : le plus petit total gagne. Résultat, les
            spécialistes ne gagnent pas. Chez les femmes, la meilleure charge de la Strength zone (326 kg) finit{" "}
            <strong>33<sup>e</sup></strong> au général, car elle est 76<sup>e</sup> en endurance. Chez les hommes, le
            meilleur en endurance termine <strong>13<sup>e</sup></strong>. Les vainqueurs, eux, sont dans le top 15 des
            trois zones.
          </p>
          <h3>La force fait la différence… à condition de tenir le reste</h3>
          <p>
            L&apos;écart entre le top 10 % et le milieu du classement est d&apos;environ 60 kg chez les femmes et plus de 70
            kg chez les hommes en Strength zone. C&apos;est la zone où l&apos;on gagne le plus de places avec un cycle de
            force bien construit : estimez vos charges avec le <Link href="/calculateur-1rm">calculateur 1RM</Link> et
            lisez notre guide de <Link href="/workouts-athx-2027/strength-zone">la Strength zone</Link>.
          </p>
          <h3>Le Metcon X sépare les niveaux</h3>
          <p>
            Les meilleurs bouclent le Metcon X en un peu plus de 9 minutes, quand la fin du classement dépasse les 20
            minutes. C&apos;est la dernière épreuve, après deux heures d&apos;effort : ceux qui ont bien géré les zones
            précédentes y gagnent des places. Voir <Link href="/blog/metcon-x-explique">le Metcon X expliqué</Link>.
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
              <Link href="/calculateur-endurance-zone-athx">calculateur Endurance zone</Link>.
            </li>
          </ul>
          <p>
            Ces paliers restent le meilleur repère disponible sur le niveau des participants en France. Tous les détails
            du format 2027 sont dans notre guide des <Link href="/workouts-athx-2027">workouts ATHX 2027</Link>, et les
            charges par catégorie dans <Link href="/categories-athx">les catégories ATHX</Link>.
          </p>

          <h2>Méthode</h2>
          <p>
            Les données viennent du classement public d&apos;ATHX Games (athxgames.com) pour les étapes de Paris et de
            Marseille 2026, en individuel, catégories ATHX et Pro réunies. Chaque résultat donne une place et un score
            dans chaque zone : les paliers sont calculés à partir de ces couples place-score, par interpolation entre les
            places connues. Les charges sont arrondies à 5 kg, les distances à 10 m et les temps à 5 secondes. Aucun nom
            d&apos;athlète n&apos;est repris sur cette page.
          </p>
          <p>
            Vous citez ces chiffres ? Merci d&apos;indiquer la source avec un lien vers cette page.
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
          <h2 className="h-sec">Visez le palier au-dessus.</h2>
          <p className="mute" style={{ margin: "14px auto 0" }}>
            12 semaines de préparation ATHX calculées sur vos PR. Paiement unique de {formatPrice(site.price)}.{" "}
            <Link href="/semaine-athx-gratuite">Testez d&apos;abord la semaine gratuite</Link>.
          </p>
          <Link href="/#cta" className="btn btn-signal">
            Obtenir mon programme
          </Link>
        </div>
      </section>
    </main>
  );
}
