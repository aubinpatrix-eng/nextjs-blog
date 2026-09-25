"use client";

import { estimateOneRm, formatLoad, loadForReps } from "@/lib/one-rm";
import { useState } from "react";

const PERCENTAGES = [95, 90, 85, 80, 75, 70, 65, 60];
const REP_MAXES = [2, 3, 5];

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
            <div className="field">
              <label htmlFor="weight">Charge soulevée ({unit})</label>
              <input
                type="number"
                id="weight"
                min="0"
                step="0.5"
                inputMode="decimal"
                placeholder="ex. 90"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="reps">Répétitions réalisées</label>
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
        <p className="fine">
          Estimation par la moyenne des formules d&apos;Epley et de Brzycki, arrondie à 2,5 {unit}. Plus le nombre de
          répétitions est faible, plus l&apos;estimation est précise.
        </p>
      </div>

      <div className="preview-card" aria-live="polite">
        <h2 className="h-card">Votre 1RM estimé</h2>
        <div className="big-num">{oneRm ? format(oneRm) : "—"}</div>
        {oneRm ? (
          <>
            <div className="preview-sub">Répétitions maximales estimées (format Strength zone ATHX 2027)</div>
            {REP_MAXES.map((n) => (
              <div className="preview-row" key={n}>
                <span className="lift">{n}RM</span>
                <span className="val">{format(loadForReps(oneRm, n))}</span>
              </div>
            ))}
            <div className="preview-sub" style={{ marginTop: 22 }}>
              Charges d&apos;entraînement
            </div>
            {PERCENTAGES.map((pct) => (
              <div className="preview-row" key={pct}>
                <span className="lift">{pct} %</span>
                <span className="val">{format((oneRm * pct) / 100)}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="preview-empty">Entrez une charge et un nombre de répétitions.</div>
        )}
      </div>
    </div>
  );
}
