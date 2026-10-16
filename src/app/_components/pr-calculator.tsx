"use client";

import { decimal, isEn } from "@/lib/i18n";
import { useState } from "react";

type Props = {
  buyUrl: string;
  priceLabel: string;
  comparePriceLabel: string | null;
};

type Level = "Lite" | "ATHX" | "Pro";

const LEVEL_FACTOR: Record<Level, number> = { Lite: 0.65, ATHX: 0.73, Pro: 0.82 };
const LB_PER_KG = 2.2046;

const COPY = isEn
  ? {
      unit: "Unit",
      kg: "Kilograms",
      lb: "Pounds",
      squat: "Back squat — 5×3",
      press: "Overhead press — 5×3",
      deadlift: "Deadlift — 3×3",
      squatLabel: (unit: string) => `Back squat — 1RM (${unit})`,
      pressLabel: (unit: string) => `Strict overhead press — 1RM (${unit})`,
      deadliftLabel: (unit: string) => `Deadlift — 1RM (${unit})`,
      example: "e.g.",
      category: "Target category",
      email: "Email (to receive the program)",
      emailPlaceholder: "you@example.com",
      previewTitle: "Preview — week 1, strength block",
      previewSub: (level: string) => `Week 1 loads — ${level} category, based on your PRs`,
      previewHint: "Enter your PRs to generate your preview",
      previewEmpty: "Your loads will appear here once you enter your lifts.",
      instead: "instead of",
      buy: "Buy my full program",
      soon: "Coming soon",
      fine: "Secure payment. Instant access to the full PDF + 12-week follow-up. The program is written in French.",
    }
  : {
      unit: "Unité",
      kg: "Kilogrammes",
      lb: "Livres",
      squat: "Squat arrière — 5×3",
      press: "Développé militaire — 5×3",
      deadlift: "Soulevé de terre — 3×3",
      squatLabel: (unit: string) => `Squat arrière — 1RM (${unit})`,
      pressLabel: (unit: string) => `Développé militaire strict — 1RM (${unit})`,
      deadliftLabel: (unit: string) => `Soulevé de terre — 1RM (${unit})`,
      example: "ex.",
      category: "Catégorie visée",
      email: "E-mail (réception du programme)",
      emailPlaceholder: "vous@exemple.fr",
      previewTitle: "Aperçu — semaine 1, bloc force",
      previewSub: (level: string) => `Paliers semaine 1 — catégorie ${level}, calculés sur vos PR déclarés`,
      previewHint: "Renseignez vos PR pour générer votre aperçu",
      previewEmpty: "Vos paliers s'afficheront ici une fois vos charges saisies.",
      instead: "au lieu de",
      buy: "Acheter mon programme complet",
      soon: "Bientôt disponible",
      fine: "Paiement sécurisé. Accès immédiat au PDF complet + suivi des 12 semaines.",
    };

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
    return `${decimal(rounded)} ${unit}`;
  };
  const rows = [
    { lift: COPY.squat, value: squat, ratio: factor },
    { lift: COPY.press, value: press, ratio: factor },
    { lift: COPY.deadlift, value: deadlift, ratio: factor + 0.05 },
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
        <div className="unit-toggle" role="group" aria-label={COPY.unit}>
          <button type="button" className={unit === "kg" ? "active" : ""} onClick={() => setUnit("kg")}>
            {COPY.kg}
          </button>
          <button type="button" className={unit === "lb" ? "active" : ""} onClick={() => setUnit("lb")}>
            {COPY.lb}
          </button>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="field-row">
            <Field id="squat" label={COPY.squatLabel(unit)} value={squat} onChange={setSquat} placeholder={`${COPY.example} 100`} />
            <Field id="press" label={COPY.pressLabel(unit)} value={press} onChange={setPress} placeholder={`${COPY.example} 45`} />
          </div>
          <Field id="deadlift" label={COPY.deadliftLabel(unit)} value={deadlift} onChange={setDeadlift} placeholder={`${COPY.example} 130`} />
          <div className="field-row">
            <div className="field">
              <label htmlFor="level">{COPY.category}</label>
              <select id="level" value={level} onChange={(event) => setLevel(event.target.value as Level)}>
                <option>Lite</option>
                <option>ATHX</option>
                <option>Pro</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="email">{COPY.email}</label>
              <input
                type="email"
                id="email"
                placeholder={COPY.emailPlaceholder}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
          </div>
        </form>
      </div>

      <div className="preview-card" aria-live="polite">
        <h3>{COPY.previewTitle}</h3>
        <div className="preview-sub">{rows.length > 0 ? COPY.previewSub(level) : COPY.previewHint}</div>
        {rows.length > 0 ? (
          rows.map((row) => (
            <div className="preview-row" key={row.lift}>
              <span className="lift">{row.lift}</span>
              <span className="val">{load(row.value, row.ratio)}</span>
            </div>
          ))
        ) : (
          <div className="preview-empty">{COPY.previewEmpty}</div>
        )}

        <div className="buy-panel">
          <div className="price-row">
            <span className="amount">{priceLabel}</span>
            {comparePriceLabel && (
              <span className="was">
                {COPY.instead} {comparePriceLabel}
              </span>
            )}
          </div>
          {checkoutUrl ? (
            <a href={checkoutUrl} className="btn btn-signal btn-block">
              {COPY.buy}
            </a>
          ) : (
            <span className="btn btn-signal btn-block btn-disabled" aria-disabled>
              {COPY.soon}
            </span>
          )}
          <p className="fine">{COPY.fine}</p>
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
