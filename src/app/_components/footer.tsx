import { getAllPages } from "@/lib/api";
import { getSite } from "@/lib/site";
import Link from "next/link";

export default function Footer() {
  const site = getSite();
  const pages = getAllPages();

  return (
    <footer>
      <div className="wrap">
        <div className="foot-row">
          <div>
            <Link href="/">Accueil</Link>
            <Link href="/#programme">Programme</Link>
            <Link href="/calculateur-1rm">Calculateur 1RM</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/qui-suis-je">Qui suis-je</Link>
            {site.instagram && (
              <a href={site.instagram} rel="me noopener" target="_blank">
                Instagram
              </a>
            )}
          </div>
          <div>
            © {new Date().getFullYear()} {site.name} — Tous droits réservés
          </div>
        </div>
        {pages.length > 0 && (
          <div className="foot-row foot-legal">
            <div>
              {pages.map((page) => (
                <Link key={page.slug} href={`/${page.slug}`}>
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        )}
        <p className="disclaimer">{site.disclaimer}</p>
      </div>
    </footer>
  );
}
