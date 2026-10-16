import { href, isEn } from "@/lib/i18n";
import type { TocEntry } from "@/lib/markdownToHtml";
import type { About } from "@/lib/site";
import Link from "next/link";

export function KeyTakeaways({ summary }: { summary: string }) {
  return (
    <aside className="article-box takeaway">
      <h2>{isEn ? "Key takeaways" : "Ce qu'il faut retenir"}</h2>
      <p>{summary}</p>
    </aside>
  );
}

export function TableOfContents({ toc, headingLevel = 2 }: { toc: TocEntry[]; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <nav className="article-box toc" aria-label={isEn ? "Contents" : "Sommaire"}>
      <Heading>{isEn ? "Contents" : "Sommaire"}</Heading>
      <ol>
        {toc.map((entry) => (
          <li key={entry.id} className={`toc-h${entry.level}`}>
            <a href={`#${entry.id}`}>{entry.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function ArticleFaq({ faq }: { faq: { question: string; answer: string }[] }) {
  return (
    <section className="article-faq" aria-labelledby="faq">
      <h2 id="faq">{isEn ? "Frequently asked questions" : "Questions fréquentes"}</h2>
      {faq.map((item, index) => (
        <details className="faq-item" key={item.question} open={index === 0}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </section>
  );
}

export function AuthorBox({ about }: { about: About }) {
  return (
    <aside className="author-box" aria-label={isEn ? "Author" : "Auteur"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={about.avatar || about.photo} alt={about.name} width={160} height={160} loading="lazy" />
      <div>
        <div className="author-label">{isEn ? "Author" : "Auteur"}</div>
        <Link href={href("/qui-suis-je")} className="author-name">
          {about.name}
        </Link>
        <p>{about.bio}</p>
        <Link href={href("/qui-suis-je")} className="post-read">
          {isEn ? "More about the author" : "En savoir plus sur l'auteur"}
        </Link>
      </div>
    </aside>
  );
}
