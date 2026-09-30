// Endurance zone ATHX 2027: a fixed-distance run, then max SkiErg metres, all within a 24-minute cap.
export const ENDURANCE_CAP_SECONDS = 24 * 60;

// Parses "4:45", "4.45" or "4'45" into seconds. Returns null when the value is not a valid mm:ss time.
export function parseTime(value: string): number | null {
  const match = value.trim().match(/^(\d{1,2})(?:[:.'’h ](\d{1,2}))?$/);
  if (!match) return null;
  const minutes = parseInt(match[1], 10);
  const seconds = match[2] ? parseInt(match[2], 10) : 0;
  if (seconds >= 60) return null;
  const total = minutes * 60 + seconds;
  return total > 0 ? total : null;
}

export function formatTime(totalSeconds: number) {
  const rounded = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(rounded / 60);
  const seconds = rounded % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatMetres(metres: number) {
  return `${new Intl.NumberFormat("fr-FR").format(Math.floor(metres))} m`;
}

type Plan = {
  runKm: number;
  runPace: number; // seconds per km
  transition: number; // seconds
  skiPace: number; // seconds per 500 m
};

export function endurancePlan({ runKm, runPace, transition, skiPace }: Plan) {
  const runTime = runKm * runPace;
  const skiTime = Math.max(0, ENDURANCE_CAP_SECONDS - runTime - transition);
  const skiMetres = (skiTime / skiPace) * 500;
  return { runTime, skiTime, skiMetres };
}

// SkiErg pace (seconds per 500 m) needed to reach a target distance in the remaining time.
export function skiPaceForTarget(targetMetres: number, skiTime: number) {
  return targetMetres > 0 && skiTime > 0 ? (skiTime / targetMetres) * 500 : null;
}
