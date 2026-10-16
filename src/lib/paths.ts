import { findByKey } from "./content";
import { absoluteUrl, href, LOCALE, STATIC_ROUTES } from "./i18n";

// Server-side: the address of a page in the current language, from its French path.
// Fixed routes use the route table; CMS pages (posts, guides, city pages, legal pages) are found through
// their file name, shared by both languages. A page with no English version links to the French site.
export function localPath(frPath: string): string {
  if (LOCALE === "fr") return frPath;
  const match = frPath.match(/^([^?#]*)(.*)$/);
  const [path, rest] = [match?.[1] ?? frPath, match?.[2] ?? ""];
  if (path === "" || path === "/" || path === "/blog" || STATIC_ROUTES[path] || path.startsWith("/blog/categorie/")) {
    return href(frPath);
  }
  const segments = path.split("/").filter(Boolean);
  let translated: string | null = null;
  if (segments[0] === "blog" && segments.length === 2) {
    const post = findByKey("posts", segments[1], LOCALE);
    translated = post && `/blog/${post.slug}`;
  } else if (segments.length === 2) {
    const guide = findByKey("guides", segments[1], LOCALE);
    translated = guide && guide.data.parent ? `/${guide.data.parent}/${guide.slug}` : null;
  } else if (segments.length === 1) {
    const entry =
      findByKey("guides", segments[0], LOCALE) ?? findByKey("events", segments[0], LOCALE) ?? findByKey("pages", segments[0], LOCALE);
    translated = entry && `/${entry.slug}`;
  }
  return translated ? `${translated}${rest}` : absoluteUrl(frPath, "fr");
}
