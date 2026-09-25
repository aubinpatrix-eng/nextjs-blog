import { remark } from "remark";
import html from "remark-html";

export default async function markdownToHtml(markdown: string) {
  // Pages CMS rich-text fields can contain raw HTML (tables, embeds): keep it.
  const result = await remark().use(html, { sanitize: false }).process(markdown);
  return result.toString();
}
