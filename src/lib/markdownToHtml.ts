import { remark } from "remark";
import html from "remark-html";

export type TocEntry = {
  id: string;
  text: string;
  level: 2 | 3 | 4;
};

export default async function markdownToHtml(markdown: string) {
  // Pages CMS rich-text fields can contain raw HTML (tables, embeds): keep it.
  const result = await remark().use(html, { sanitize: false }).process(markdown);
  return result.toString();
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
