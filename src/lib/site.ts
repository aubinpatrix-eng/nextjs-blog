import fs from "fs";
import { join } from "path";
import { LANG_TAG, LOCALE, SITE_URLS } from "./i18n";

// Edited from Pages CMS ("Réglages du site", "Page d'accueil", "Qui suis-je", and their English versions).

export type Site = {
  name: string;
  url: string;
  title: string;
  description: string;
  price: number;
  comparePrice: number | null;
  buyUrl: string;
  sessionsPerWeek: number | null;
  sessionMinutes: number | null;
  instagram: string;
  disclaimer: string;
};

export type Home = {
  hero: {
    kicker: string;
    title: string;
    lede: string;
    offerNote: string;
    features: string[];
    image?: string;
    imageAlt?: string;
  };
  personas?: {
    title: string;
    lede: string;
    items: { image: string; imageAlt?: string; label: string; title: string; text: string }[];
  };
  stats: { value: string; label: string }[];
  format: {
    title: string;
    lede: string;
    zones: { name: string; description: string; duration: string }[];
  };
  program: {
    title: string;
    lede: string;
    blocks: { title: string; description: string }[];
  };
  cta: { title: string; lede: string };
  faq: { question: string; answer: string }[];
  finalCta: string;
  finalImage?: string;
  finalImageAlt?: string;
};

export type About = {
  name: string;
  kicker: string;
  title: string;
  headline: string;
  bio: string;
  intro: string;
  paragraphs: string[];
  results: { value: string; label: string }[];
  proofImage: string;
  proofCaption: string;
  photo: string;
  avatar: string;
  photos: { image: string; caption: string }[];
};

// French data lives in _data/*.json; the English site reads _data/en/*.json when it exists.
// _data/en/site.json only overrides the texts (and optionally the Stripe link): price and settings stay shared.
function readJson<T>(path: string): T | null {
  const fullPath = join(process.cwd(), "_data", path);
  return fs.existsSync(fullPath) ? (JSON.parse(fs.readFileSync(fullPath, "utf8")) as T) : null;
}

function readData<T>(file: string): T {
  const translated = LOCALE === "fr" ? null : readJson<T>(`${LOCALE}/${file}`);
  return translated ?? (readJson<T>(file) as T);
}

export function getSite(): Site {
  const site = readJson<Site>("site.json") as Site;
  const overrides = LOCALE === "fr" ? null : readJson<Partial<Site>>(`${LOCALE}/site.json`);
  // A field left empty in Pages CMS keeps the French value (e.g. the Stripe link).
  const filled = Object.fromEntries(Object.entries(overrides ?? {}).filter(([, value]) => value !== "" && value != null));
  return { ...site, ...filled, url: SITE_URLS[LOCALE] };
}

export function getHome(): Home {
  return readData<Home>("home.json");
}

export function getAbout(): About {
  return readData<About>("about.json");
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat(LANG_TAG[LOCALE], { style: "currency", currency: "EUR" }).format(price);
}
