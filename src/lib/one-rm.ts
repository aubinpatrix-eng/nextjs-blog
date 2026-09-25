// Average of the Epley and Brzycki formulas, reliable up to about 10 reps.
export function estimateOneRm(weight: number, reps: number) {
  if (reps === 1) return weight;
  const epley = weight * (1 + reps / 30);
  const brzycki = (weight * 36) / (37 - reps);
  return (epley + brzycki) / 2;
}

// Inverse of the same average: the load you can lift for `reps` reps.
export function loadForReps(oneRm: number, reps: number) {
  if (reps === 1) return oneRm;
  return oneRm / ((1 + reps / 30 + 36 / (37 - reps)) / 2);
}

export function roundLoad(value: number) {
  return Math.round(value / 2.5) * 2.5;
}

export function formatLoad(value: number, unit: string) {
  return `${roundLoad(value).toFixed(1).replace(/\.0$/, "").replace(".", ",")} ${unit}`;
}
