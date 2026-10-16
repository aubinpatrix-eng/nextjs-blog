import { absoluteUrl, LOCALE } from "@/lib/i18n";
import { sitemapEntries } from "@/lib/sitemap-entries";

export const dynamic = "force-static";

const escape = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Sitemap with hreflang alternates (fr, en, x-default → English) for every page that exists in both languages.
export function GET() {
  const urls = sitemapEntries()
    .filter((entry) => entry.paths[LOCALE])
    .map(({ paths, lastModified }) => {
      const alternates =
        paths.fr && paths.en
          ? [
              ["fr", absoluteUrl(paths.fr, "fr")],
              ["en", absoluteUrl(paths.en, "en")],
              ["x-default", absoluteUrl(paths.en, "en")],
            ]
              .map(([lang, url]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${escape(url)}"/>`)
              .join("")
          : "";
      return `<url><loc>${escape(absoluteUrl(paths[LOCALE] as string))}</loc>${alternates}${
        lastModified ? `<lastmod>${lastModified}</lastmod>` : ""
      }</url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
