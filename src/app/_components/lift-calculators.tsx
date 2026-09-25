"use client";

import { estimateOneRm, formatLoad, loadForReps, roundLoad } from "@/lib/one-rm";
import { useState } from "react";

type Lift = {
  id: string;
  name: string;
  // Rep max tested in the ATHX 2027 Strength zone for this movement.
  athxReps: number;
  athxLabel: string;
  note: string;
};

const LIFTS: Lift[] = [
  {
    id: "squat",
    name: "Squat arrière",
    athxReps: 2,
    athxLabel: "2RM squat arrière",
    note: "Profondeur complète : pli de hanche sous le haut du genou.",
  },
  {
    id: "deadlift",
    name: "Soulevé de terre",
    athxReps: 3,
    athxLabel: "3RM soulevé de terre",
    note: "En continu ou en 3 singles dans le temps imparti.",
  },
  {
    id: "press",
    name: "Développé militaire",
    athxReps: 1,
    athxLabel: "1RM shoulder-to-overhead",
    note: "L'ATHX autorise l'impulsion des jambes : votre shoulder-to-overhead sera en général plus lourd que votre développé strict.",
  },
];

type Entry = { weight: string; reps: string };

export default function LiftCalculators() {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [entries, setEntries] = useState<Record<string, Entry>>(
    Object.fromEntries(LIFTS.map((lift) => [lift.id, { weight: "", reps: "5" }])),
  );

  const update = (id: string, field: keyof Entry, value: string) =>
    setEntries((current) => ({ ...current, [id]: { ...current[id], [field]: value } }));

  const results = LIFTS.map((lift) => {
    const weight = parseFloat(entries[lift.id].weight);
    const reps = parseInt(entries[lift.id].reps, 10);
    const oneRm = weight > 0 ? estimateOneRm(weight, reps) : null;
    return { lift, oneRm, athxLoad: oneRm ? loadForReps(oneRm, lift.athxReps) : null };
  });
  const complete = results.every((result) => result.athxLoad);
  // Sum of rounded loads, as each attempt is loaded to the nearest 2.5.
  const total = results.reduce((sum, result) => sum + (result.athxLoad ? roundLoad(result.athxLoad) : 0), 0);

  return (
    <>
      <div className="unit-toggle lift-unit" role="group" aria-label="Unité">
        <button type="button" className={unit === "kg" ? "active" : ""} onClick={() => setUnit("kg")}>
          Kilogrammes
        </button>
        <button type="button" className={unit === "lb" ? "active" : ""} onClick={() => setUnit("lb")}>
          Livres
        </button>
      </div>
      <div className="program-grid">
        {results.map(({ lift, oneRm, athxLoad }) => (
          <div className="program-cell lift-cell" key={lift.id}>
            <h3>{lift.name}</h3>
            <div className="field">
              <label htmlFor={`${lift.id}-weight`}>Charge soulevée ({unit})</label>
              <input
                type="number"
                id={`${lift.id}-weight`}
                min="0"
                step="0.5"
                inputMode="decimal"
                placeholder="ex. 100"
                value={entries[lift.id].weight}
                onChange={(event) => update(lift.id, "weight", event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor={`${lift.id}-reps`}>Répétitions réalisées</label>
              <select
                id={`${lift.id}-reps`}
                value={entries[lift.id].reps}
                onChange={(event) => update(lift.id, "reps", event.target.value)}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="preview-row">
              <span className="lift">1RM estimé</span>
              <span className="val">{oneRm ? formatLoad(oneRm, unit) : "—"}</span>
            </div>
            <div className="preview-row">
              <span className="lift">{lift.athxLabel}</span>
              <span className="val">{athxLoad ? formatLoad(athxLoad, unit) : "—"}</span>
            </div>
            <p className="fine">{lift.note}</p>
          </div>
        ))}
      </div>
      <div className="lift-total" aria-live="polite">
        <span>Total Strength zone estimé (format ATHX 2027)</span>
        <span className="val">
          {complete ? `${total.toFixed(1).replace(/\.0$/, "").replace(".", ",")} ${unit}` : "Remplissez les 3 mouvements"}
        </span>
      </div>
    </>
  );
}
