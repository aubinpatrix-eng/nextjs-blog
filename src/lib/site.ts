import fs from "fs";
import { join } from "path";

// Both files are edited from Pages CMS ("Réglages du site" / "Page d'accueil").

export type Site = {
  name: string;
  url: string;
  title: string;
  description: string;
  price: number;
  comparePrice: number | null;
  buyUrl: string;
  newsletterAction: string;
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
};

export type About = {
  name: string;
  kicker: string;
  title: string;
  headline: string;
  intro: string;
  paragraphs: string[];
  results: { value: string; label: string }[];
  proofImage: string;
  proofCaption: string;
  photo: string;
  photos: { image: string; caption: string }[];
};

function readData<T>(file: string): T {
  return JSON.parse(fs.readFileSync(join(process.cwd(), "_data", file), "utf8"));
}

export function getSite(): Site {
  const site = readData<Site>("site.json");
  return { ...site, url: site.url.replace(/\/$/, "") };
}

export function getHome(): Home {
  return readData<Home>("home.json");
}

export function getAbout(): About {
  return readData<About>("about.json");
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(price);
}
