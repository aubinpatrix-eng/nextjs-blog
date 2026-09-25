import fs from "fs";
import { join } from "path";

export type Site = {
  title: string;
  description: string;
  intro: string;
  footerTitle: string;
  footerLinkLabel: string;
  footerLinkUrl: string;
};

// Edited from Pages CMS ("Réglages du site").
export function getSite(): Site {
  const fullPath = join(process.cwd(), "_data", "site.json");
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}
