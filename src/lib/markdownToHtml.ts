import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export default async function markdownToHtml(markdown: string) {
  // Pages CMS rich-text fields can contain raw HTML (tables, embeds): keep it.
  // remark-gfm adds tables, strikethrough and autolinks (GitHub-flavoured Markdown).
  const result = await remark().use(remarkGfm).use(html, { sanitize: false }).process(markdown);
  // Wrap tables so wide ones scroll horizontally on mobile instead of breaking the layout.
  return result.toString().replace(/<table>[\s\S]*?<\/table>/g, (table) => `<div class="table-wrap">${table}</div>`);
}

function slugify(text: string) {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&[a-z#0-9]+;/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

// Renders the article and gives every h2-h4 a unique id, collected as a table of contents.
export async function markdownToHtmlWithToc(markdown: string) {
  const rendered = await markdownToHtml(markdown);
  const toc: TocEntry[] = [];
  const used = new Map<string, number>();

  const content = rendered.replace(/<h([234])>([\s\S]*?)<\/h\1>/g, (_, level: string, inner: string) => {
    const text = stripTags(inner);
    const base = slugify(text);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    toc.push({ id, text, level: Number(level) as TocEntry["level"] });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });

  return { content, toc };
}

// Splits article html in two before the h2 closest to the middle (for a mid-content call to action).
export function splitAtMiddleHeading(html: string): [string, string] {
  const positions = Array.from(html.matchAll(/<h2[ >]/g), (match) => match.index ?? 0).filter((index) => index > 0);
  if (positions.length < 2) return [html, ""];
  const middle = html.length / 2;
  const cut = positions.reduce((best, index) => (Math.abs(index - middle) < Math.abs(best - middle) ? index : best));
  return [html.slice(0, cut), html.slice(cut)];
}
