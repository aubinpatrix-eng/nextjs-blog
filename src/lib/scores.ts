import fs from "fs";
import { join } from "path";

// Public ATHX leaderboard rows (no athlete names), transcribed into _data/scores/*.csv.
// Each row gives, for every scored zone, a (rank, score) pair. Levels such as "top 25 %" are read
// by interpolating between the known ranks, so the page stays accurate without the full leaderboard.

export type Zone = "strength" | "endurance" | "metcon";

export type ScoreSet = {
  id: string;
  label: string;
  athletes: number;
  file: string;
};

export const SEASON_2026: ScoreSet[] = [
  { id: "femmes", label: "Femmes", athletes: 115, file: "femmes-individuel-2026.csv" },
  { id: "hommes", label: "Hommes", athletes: 280, file: "hommes-individuel-2026.csv" },
];

export const LEVELS = [
  { id: "top10", label: "Top 10 %", share: 0.1 },
  { id: "top25", label: "Top 25 %", share: 0.25 },
  { id: "median", label: "Milieu du classement", share: 0.5 },
  { id: "p75", label: "75 % du classement", share: 0.75 },
];

type Point = { rank: number; value: number };

function toSeconds(time: string) {
  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
}

function readRows(file: string) {
  const [header, ...lines] = fs.readFileSync(join(process.cwd(), "_data", "scores", file), "utf8").trim().split("\n");
  const keys = header.split(",");
  return lines.map((line) => Object.fromEntries(line.split(",").map((cell, i) => [keys[i], cell.trim()])));
}

function zonePoints(rows: Record<string, string>[], zone: Zone): Point[] {
  const column = { strength: "strength_kg", endurance: "endurance_km", metcon: "metcon_time" }[zone];
  const seen = new Map<number, number>();
  for (const row of rows) {
    // Partial rows (e.g. a strength-only leaderboard) leave the other zones empty.
    if (!row[`${zone}_rank`] || !row[column]) continue;
    const value = zone === "metcon" ? toSeconds(row[column]) : parseFloat(row[column]);
    seen.set(parseInt(row[`${zone}_rank`], 10), value);
  }
  return Array.from(seen, ([rank, value]) => ({ rank, value })).sort((a, b) => a.rank - b.rank);
}

// Score at a given rank, or null when the nearest known ranks are too far apart to be reliable.
function valueAtRank(points: Point[], rank: number, maxGap: number) {
  const exact = points.find((point) => point.rank === rank);
  if (exact) return exact.value;
  const below = [...points].reverse().find((point) => point.rank < rank);
  const above = points.find((point) => point.rank > rank);
  if (!below || !above || above.rank - below.rank > maxGap) return null;
  return below.value + ((above.value - below.value) * (rank - below.rank)) / (above.rank - below.rank);
}

export function getScoreTable(set: ScoreSet) {
  const rows = readRows(set.file);
  const maxGap = Math.round(set.athletes * 0.16);
  const zones = (["strength", "endurance", "metcon"] as Zone[]).map((zone) => ({ zone, points: zonePoints(rows, zone) }));
  return {
    ...set,
    // Best score of each zone, only when rank 1 is in the data.
    best: Object.fromEntries(
      zones.map(({ zone, points }) => [zone, points[0]?.rank === 1 ? points[0].value : null]),
    ) as Record<Zone, number | null>,
    levels: LEVELS.map((level) => {
      const rank = Math.max(1, Math.round(level.share * set.athletes));
      return {
        ...level,
        rank,
        values: Object.fromEntries(zones.map(({ zone, points }) => [zone, valueAtRank(points, rank, maxGap)])) as Record<
          Zone,
          number | null
        >,
      };
    }),
  };
}

// Levels are estimates: rounded to 5 kg, 10 m and 5 s. Exact scores (best of the day) are shown as is.
export function formatScore(zone: Zone, value: number | null, exact = false) {
  if (value === null) return "—";
  if (zone === "strength") return `${exact ? value : Math.round(value / 5) * 5} kg`;
  if (zone === "endurance") {
    const digits = exact ? 3 : 2;
    return `${value.toLocaleString("fr-FR", { minimumFractionDigits: digits, maximumFractionDigits: digits })} km`;
  }
  const seconds = exact ? value : Math.round(value / 5) * 5;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
