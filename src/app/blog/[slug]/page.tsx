import { ArticleFaq, AuthorBox, KeyTakeaways, TableOfContents } from "@/app/_components/article-blocks";
import JsonLd from "@/app/_components/json-ld";
import PostCard, { DateLabel } from "@/app/_components/post-card";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { markdownToHtmlWithToc } from "@/lib/markdownToHtml";
import { breadcrumbSchema, faqSchema, organizationId, personId, personSchema } from "@/lib/schema";
import { formatPrice, getAbout, getSite } from "@/lib/site";
import { getTag } from "@/lib/tags";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = {
  params: {
    slug: string;
  };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return {};
  }
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      ...(post.coverImage && { images: [post.coverImage] }),
    },
  };
}

export default async function Article({ params }: Params) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }
  const site = getSite();
  const tag = getTag(post.tag);
  const about = getAbout();
  const { content, toc } = await markdownToHtmlWithToc(post.content);
  const faq = post.faq ?? [];
  if (faq.length > 0) toc.push({ id: "faq", text: "Questions fréquentes", level: 2 });
  // Articles are signed by the site author unless another author is set in Pages CMS.
  const authorName = post.author || about.name;
  const isSiteAuthor = authorName === about.name;
  const related = getAllPosts()
    .filter((other) => other.slug !== post.slug)
    .sort((a, b) => Number(b.tag === post.tag) - Number(a.tag === post.tag))
    .slice(0, 3);
  const url = `${site.url}/blog/${post.slug}`;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              "@id": `${url}#article`,
              headline: post.title,
              description: post.excerpt,
              ...(post.summary && { abstract: post.summary }),
              datePublished: post.date,
              dateModified: post.updated ?? post.date,
              inLanguage: "fr-FR",
              mainEntityOfPage: url,
              image: `${site.url}${post.coverImage ?? about.photo}`,
              ...(tag && { articleSection: tag.label }),
              wordCount: post.content.split(/\s+/).filter(Boolean).length,
              author: isSiteAuthor ? { "@id": personId(site) } : { "@type": "Person", name: authorName },
              publisher: { "@type": "Organization", "@id": organizationId(site), name: site.name, url: site.url },
            },
            ...(isSiteAuthor ? [personSchema(site, about)] : []),
            ...(faq.length > 0 ? [faqSchema(faq)] : []),
            breadcrumbSchema(site, [
              { name: "Accueil", path: "" },
              { name: "Blog", path: "/blog" },
              ...(tag ? [{ name: tag.label, path: `/blog/categorie/${tag.slug}` }] : []),
              { name: post.title },
            ]),
          ],
        }}
      />

      <article>
        <header className="page-hero">
          <div className="wrap">
            <nav className="breadcrumb" aria-label="Fil d'Ariane">
              <ol>
                <li>
                  <Link href="/">Accueil</Link>
                </li>
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                {tag && (
                  <li>
                    <Link href={`/blog/categorie/${tag.slug}`}>{tag.label}</Link>
                  </li>
                )}
              </ol>
            </nav>
            <h1 className="h-page">{post.title}</h1>
            <p className="lede">{post.excerpt}</p>
            <div className="article-meta">
              <DateLabel date={post.date} />
              <span>{post.readingTime} min de lecture</span>
              <span>
                Par {isSiteAuthor ? <Link href="/qui-suis-je">{authorName}</Link> : authorName}
              </span>
            </div>
            {post.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.coverImage} alt="" className="article-cover" />
            )}
          </div>
        </header>

        <section className="last" style={{ paddingTop: 0 }}>
          <div className="wrap">
            {post.summary && <KeyTakeaways summary={post.summary} />}
            {toc.length > 1 && <TableOfContents toc={toc} />}
            <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
            {faq.length > 0 && <ArticleFaq faq={faq} />}
            <aside className="article-cta">
              <h2>Préparez l&apos;ATHX avec un plan calculé sur vos PR</h2>
              <p>12 semaines de force, d&apos;endurance et de simulation Metcon X. Paiement unique de {formatPrice(site.price)}.</p>
              <Link href="/#cta" className="btn btn-signal">
                Obtenir mon programme
              </Link>
            </aside>
            {isSiteAuthor && <AuthorBox about={about} />}
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className="related">
          <div className="wrap">
            <h2 className="h-sec h-small">À lire aussi</h2>
            <div className="blog-grid">
              {related.map((other) => (
                <PostCard key={other.slug} post={other} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
