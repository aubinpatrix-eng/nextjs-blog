"use client";

import { endurancePlan, formatMetres, formatTime, parseTime, skiPaceForTarget } from "@/lib/endurance";
import { useState } from "react";

const PACE_STEPS = [-20, -10, 0, 10, 20];

export default function EnduranceCalculator() {
  const [distance, setDistance] = useState("3");
  const [runPace, setRunPace] = useState("5:00");
  const [skiPace, setSkiPace] = useState("2:15");
  const [transition, setTransition] = useState("20");
  const [target, setTarget] = useState("");

  const runKm = parseFloat(distance.replace(",", "."));
  const run = parseTime(runPace);
  const ski = parseTime(skiPace);
  const swap = Math.max(0, parseInt(transition, 10) || 0);
  const plan = runKm > 0 && run !== null && ski !== null ? endurancePlan({ runKm, runPace: run, transition: swap, skiPace: ski }) : null;
  // Same SkiErg pace, faster or slower run: shows the trade-off between the two parts of the zone.
  const variants =
    plan && run !== null && ski !== null
      ? PACE_STEPS.map((step) => ({ step, pace: run + step, ...endurancePlan({ runKm, runPace: run + step, transition: swap, skiPace: ski }) }))
      : [];
  const targetMetres = parseInt(target, 10);
  const neededPace = plan && targetMetres > 0 ? skiPaceForTarget(targetMetres, plan.skiTime) : null;

  return (
    <div className="cta-grid">
      <div>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="run-distance">Distance de course (km)</label>
              <input
                type="number"
                id="run-distance"
                min="0.5"
                max="6"
                step="0.1"
                inputMode="decimal"
                value={distance}
                onChange={(event) => setDistance(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="run-pace">Allure de course (min/km)</label>
              <input
                type="text"
                id="run-pace"
                inputMode="numeric"
                placeholder="ex. 5:00"
                value={runPace}
                onChange={(event) => setRunPace(event.target.value)}
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label htmlFor="ski-pace">Allure SkiErg (min/500 m)</label>
              <input
                type="text"
                id="ski-pace"
                inputMode="numeric"
                placeholder="ex. 2:15"
                value={skiPace}
                onChange={(event) => setSkiPace(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="transition">Transition course → SkiErg (s)</label>
              <input
                type="number"
                id="transition"
                min="0"
                max="120"
                step="5"
                inputMode="numeric"
                value={transition}
                onChange={(event) => setTransition(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="target">Objectif au SkiErg (m, optionnel)</label>
            <input
              type="number"
              id="target"
              min="0"
              step="50"
              inputMode="numeric"
              placeholder="ex. 2500"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            />
          </div>
        </form>
        <p className="fine">
          3 km en catégories ATHX et Pro (individuel), limite de 24 minutes. En Lite, la distance est réduite : saisissez
          celle de votre étape. Écrivez les allures au format minutes:secondes. Le calcul suppose une allure SkiErg
          constante : comptez 5 à 10 secondes de plus au 500 m que votre allure à frais.
        </p>
      </div>

      <div className="preview-card" aria-live="polite">
        <h2 className="h-card">Votre distance au SkiErg</h2>
        <div className="big-num">{plan ? formatMetres(plan.skiMetres) : "—"}</div>
        {plan ? (
          <>
            <div className="preview-row">
              <span className="lift">Temps de course</span>
              <span className="val">{formatTime(plan.runTime)}</span>
            </div>
            <div className="preview-row">
              <span className="lift">Temps restant au SkiErg</span>
              <span className="val">{formatTime(plan.skiTime)}</span>
            </div>
            {neededPace && (
              <div className="preview-row">
                <span className="lift">Allure SkiErg pour {formatMetres(targetMetres)}</span>
                <span className="val">{formatTime(neededPace)}/500 m</span>
              </div>
            )}
            {plan.skiTime === 0 && <div className="preview-empty">La course seule dépasse les 24 minutes.</div>}
            <div className="preview-sub" style={{ marginTop: 22 }}>
              Et si vous couriez plus vite ou plus lentement ?
            </div>
            {variants.map((variant) => (
              <div className="preview-row" key={variant.step}>
                <span className="lift">
                  {formatTime(variant.pace)}/km{variant.step === 0 ? " (votre allure)" : ""}
                </span>
                <span className="val">{formatMetres(variant.skiMetres)}</span>
              </div>
            ))}
          </>
        ) : (
          <div className="preview-empty">Entrez une distance et vos deux allures (ex. 5:00 et 2:15).</div>
        )}
      </div>
    </div>
  );
}
