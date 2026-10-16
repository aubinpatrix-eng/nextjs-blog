import routes from "./routes.json";

// The same code base is deployed twice: preparation-athx.fr (French, default) and en.preparation-athx.fr
// (English, built with NEXT_PUBLIC_SITE_LOCALE=en). Everything that depends on the language goes through here.

export type Locale = "fr" | "en";

export const LOCALE: Locale = process.env.NEXT_PUBLIC_SITE_LOCALE === "en" ? "en" : "fr";
export const isEn = LOCALE === "en";

export const SITE_URLS: Record<Locale, string> = {
  fr: "https://preparation-athx.fr",
  en: "https://en.preparation-athx.fr",
};

// BCP 47 tags for dates, numbers and Open Graph.
export const LANG_TAG: Record<Locale, string> = { fr: "fr-FR", en: "en-GB" };
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };

// Fixed (non-CMS) routes, French path => English path, and blog category slugs, French => English.
// Shared with next.config.js: the English build rewrites each English path to the French route folder
// and redirects the French path to the English one.
export const STATIC_ROUTES: Record<string, string> = routes.staticRoutes;
export const TAG_SLUGS: Record<string, string> = routes.tagSlugs;

// Path of a fixed route in the current language, keeping any #anchor or ?query ("/calculateur-1rm#x").
export function href(frPath: string, locale: Locale = LOCALE) {
  if (locale === "fr") return frPath;
  const match = frPath.match(/^([^?#]*)(.*)$/);
  const [path, rest] = [match?.[1] ?? frPath, match?.[2] ?? ""];
  const category = path.match(/^\/blog\/categorie\/([^/]+)$/);
  if (category) return `/blog/category/${TAG_SLUGS[category[1]] ?? category[1]}${rest}`;
  return `${STATIC_ROUTES[path] ?? path}${rest}`;
}

// The English build serves fixed routes and categories through rewrites, so a page can see its internal
// route (/calculateur-1rm, /blog/categorie/strength) instead of the address in the browser.
// This returns the public address for either.
export function publicPath(pathname: string) {
  if (!isEn) return pathname;
  const category = pathname.match(/^\/blog\/categorie\/([^/]+)$/);
  if (category) return `/blog/category/${category[1]}`;
  return STATIC_ROUTES[pathname] ?? pathname;
}

export function absoluteUrl(path: string, locale: Locale = LOCALE) {
  return `${SITE_URLS[locale]}${path === "/" ? "" : path}`;
}

// Canonical + hreflang links for a page. `paths` gives the page's path in each language that has it.
// x-default points to the English version, as requested for international visitors.
export function languageAlternates(paths: Partial<Record<Locale, string>>) {
  const own = paths[LOCALE];
  const languages: Record<string, string> = {};
  if (paths.fr) languages.fr = absoluteUrl(paths.fr, "fr");
  if (paths.en) languages.en = absoluteUrl(paths.en, "en");
  if (paths.en) languages["x-default"] = absoluteUrl(paths.en, "en");
  const hasBoth = Boolean(paths.fr && paths.en);
  return {
    ...(own && { canonical: own }),
    ...(hasBoth && { languages }),
  };
}

// Alternates for a fixed route given by its French path.
export function staticAlternates(frPath: string) {
  return languageAlternates({ fr: frPath, en: href(frPath, "en") });
}

// Privacy policy address, linked from client components (consent banner, newsletter form).
export const PRIVACY_PATH = isEn ? "/privacy-policy" : "/confidentialite";

// Labels shared by several pages.
export const UI = isEn
  ? { home: "Home", faq: "Frequently asked questions", inLanguage: "en-GB" }
  : { home: "Accueil", faq: "Questions fréquentes", inLanguage: "fr-FR" };

// "92.5" in English, "92,5" in French; trailing ".0" removed.
export function decimal(value: number, digits = 1) {
  const text = value.toFixed(digits).replace(/\.0+$/, "");
  return isEn ? text : text.replace(".", ",");
}
