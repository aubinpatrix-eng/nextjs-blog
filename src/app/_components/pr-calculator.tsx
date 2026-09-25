"use client";

import { useState } from "react";

type Props = {
  buyUrl: string;
  priceLabel: string;
  comparePriceLabel: string | null;
};

type Level = "Lite" | "ATHX" | "Pro";

const LEVEL_FACTOR: Record<Level, number> = { Lite: 0.65, ATHX: 0.73, Pro: 0.82 };
const LB_PER_KG = 2.2046;

export default function PrCalculator({ buyUrl, priceLabel, comparePriceLabel }: Props) {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [squat, setSquat] = useState("");
  const [press, setPress] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const [level, setLevel] = useState<Level>("ATHX");
  const [email, setEmail] = useState("");

  const factor = LEVEL_FACTOR[level];
  // Inputs are typed in the selected unit; loads are rounded to the nearest 2.5.
  const load = (value: string, ratio: number) => {
    const rounded = Math.round((parseFloat(value) * ratio) / 2.5) * 2.5;
    return `${rounded.toFixed(1).replace(/\.0$/, "").replace(".", ",")} ${unit}`;
  };
  const rows = [
    { lift: "Squat arrière — 5×3", value: squat, ratio: factor },
    { lift: "Développé militaire — 5×3", value: press, ratio: factor },
    { lift: "Soulevé de terre — 3×3", value: deadlift, ratio: factor + 0.05 },
  ].filter((row) => parseFloat(row.value) > 0);

  // PRs travel to the checkout in client_reference_id (Stripe Payment Links accept
  // letters, digits, "-" and "_"), always in kg so the program can be built from them.
  const toKg = (value: string) => {
    const number = parseFloat(value);
    if (!(number > 0)) return "0";
    return String(Math.round(unit === "kg" ? number : number / LB_PER_KG));
  };
  let checkoutUrl = buyUrl;
  if (buyUrl) {
    const url = new URL(buyUrl);
    url.searchParams.set(
      "client_reference_id",
      `${level}_SQ${toKg(squat)}_DM${toKg(press)}_SDT${toKg(deadlift)}`,
    );
    if (email) url.searchParams.set("prefilled_email", email);
    checkoutUrl = url.toString();
  }

  return (
    <div className="cta-grid">
      <div>
        <div className="unit-toggle" role="group" aria-label="Unité">
          <button type="button" className={unit === "kg" ? "active" : ""} onClick={() => setUnit("kg")}>
            Kilogrammes
          </button>
          <button type="button" className={unit === "lb" ? "active" : ""} onClick={() => setUnit("lb")}>
            Livres
          </button>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="field-row">
            <Field id="squat" label={`Squat arrière — 1RM (${unit})`} value={squat} onChange={setSquat} placeholder="ex. 100" />
            <Field id="press" label={`Développé militaire strict — 1RM (${unit})`} value={press} onChange={setPress} placeholder="ex. 45" />
          </div>
          <Field id="deadlift" label={`Soulevé de terre — 1RM (${unit})`} value={deadlift} onChange={setDeadlift} placeholder="ex. 130" />
          <div className="field-row">
            <div className="field">
              <label htmlFor="level">Catégorie visée</label>
              <select id="level" value={level} onChange={(event) => setLevel(event.target.value as Level)}>
                <option>Lite</option>
                <option>ATHX</option>
                <option>Pro</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="email">E-mail (réception du programme)</label>
              <input
                type="email"
                id="email"
                placeholder="vous@exemple.fr"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="preview-card" aria-live="polite">
        <h3>Aperçu — semaine 1, bloc force</h3>
        <div className="preview-sub">
          {rows.length > 0
            ? `Paliers semaine 1 — catégorie ${level}, calculés sur vos PR déclarés`
            : "Renseignez vos PR pour générer votre aperçu"}
        </div>
        {rows.length > 0 ? (
          rows.map((row) => (
            <div className="preview-row" key={row.lift}>
              <span className="lift">{row.lift}</span>
              <span className="val">{load(row.value, row.ratio)}</span>
            </div>
          ))
        ) : (
          <div className="preview-empty">Vos paliers s&apos;afficheront ici une fois vos charges saisies.</div>
        )}

        <div className="buy-panel">
          <div className="price-row">
            <span className="amount">{priceLabel}</span>
            {comparePriceLabel && <span className="was">au lieu de {comparePriceLabel}</span>}
          </div>
          {checkoutUrl ? (
            <a href={checkoutUrl} className="btn btn-signal btn-block">
              Acheter mon programme complet
            </a>
          ) : (
            <span className="btn btn-signal btn-block btn-disabled" aria-disabled>
              Bientôt disponible
            </span>
          )}
          <p className="fine">Paiement sécurisé. Accès immédiat au PDF complet + suivi des 12 semaines.</p>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

function Field({ id, label, value, onChange, placeholder }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        type="number"
        id={id}
        min="0"
        step="0.5"
        inputMode="decimal"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
