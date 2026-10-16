"use client";

import { isEn } from "@/lib/i18n";
import { estimateOneRm, formatLoad, loadForReps } from "@/lib/one-rm";
import { useState } from "react";

const PERCENTAGES = [95, 90, 85, 80, 75, 70, 65, 60];
const REP_MAXES = [2, 3, 5];

const COPY = isEn
  ? {
      unit: "Unit",
      kg: "Kilograms",
      lb: "Pounds",
      weight: "Weight lifted",
      reps: "Reps completed",
      example: "e.g.",
      method: (unit: string) =>
        `Estimate based on the average of the Epley and Brzycki formulas, rounded to 2.5 ${unit}. The fewer the reps, the more accurate the estimate.`,
      title: "Your estimated 1RM",
      repMaxes: "Estimated rep maxes (ATHX 2027 Strength zone format)",
      training: "Training loads",
      empty: "Enter a weight and a number of reps.",
    }
  : {
      unit: "Unité",
      kg: "Kilogrammes",
      lb: "Livres",
      weight: "Charge soulevée",
      reps: "Répétitions réalisées",
      example: "ex.",
      method: (unit: string) =>
        `Estimation par la moyenne des formules d'Epley et de Brzycki, arrondie à 2,5 ${unit}. Plus le nombre de répétitions est faible, plus l'estimation est précise.`,
      title: "Votre 1RM estimé",
      repMaxes: "Répétitions maximales estimées (format Strength zone ATHX 2027)",
      training: "Charges d'entraînement",
      empty: "Entrez une charge et un nombre de répétitions.",
    };

export default function OneRmCalculator() {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("5");

  const w = parseFloat(weight);
  const r = parseInt(reps, 10);
  const oneRm = w > 0 && r >= 1 && r <= 10 ? estimateOneRm(w, r) : null;
  const format = (value: number) => formatLoad(value, unit);

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
            <div className="field">
              <label htmlFor="weight">
                {COPY.weight} ({unit})
              </label>
              <input
                type="number"
                id="weight"
                min="0"
                step="0.5"
                inputMode="decimal"
                placeholder={`${COPY.example} 90`}
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="reps">{COPY.reps}</label>
              <select id="reps" value={reps} onChange={(event) => setReps(event.target.value)}>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <p className="fine">{COPY.method(unit)}</p>
      </div>

      <div className="preview-card" aria-live="polite">
        <h2 className="h-card">{COPY.title}</h2>
        <div className="big-num">{oneRm ? format(oneRm) : "—"}</div>
        {oneRm ? (
          <>
            <div className="preview-sub">{COPY.repMaxes}</div>
            {REP_MAXES.map((n) => (
              <div className="preview-row" key={n}>
                <span className="lift">{n}RM</span>
                <span className="val">{format(loadForReps(oneRm, n))}</span>
              </div>
            ))}
            <div className="preview-sub" style={{ marginTop: 22 }}>
              {COPY.training}
            </div>
            {PERCENTAGES.map((pct) => (
              <div className="preview-row" key={pct}>
                <span className="lift">{pct} %</span>
                <span className="val">{format((oneRm * pct) / 100)}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="preview-empty">{COPY.empty}</div>
        )}
      </div>
    </div>
  );
}
