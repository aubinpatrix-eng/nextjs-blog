import { ConsentSettingsButton } from "@/app/_components/consent-banner";
import { getAllPages } from "@/lib/api";
import { getAllEvents } from "@/lib/events";
import { getHubs, guidePath } from "@/lib/guides";
import { href, isEn } from "@/lib/i18n";
import { localPath } from "@/lib/paths";
import { getSite } from "@/lib/site";
import Link from "next/link";

const COPY = isEn
  ? {
      home: "Home",
      program: "Program",
      freeWeek: "Free week",
      oneRm: "1RM calculator",
      endurance: "Endurance zone calculator",
      results: "ATHX 2026 results",
      about: "About",
      rights: "All rights reserved",
      events: "Upcoming ATHX in France",
    }
  : {
      home: "Accueil",
      program: "Programme",
      freeWeek: "Semaine gratuite",
      oneRm: "Calculateur 1RM",
      endurance: "Calculateur Endurance zone",
      results: "Résultats ATHX 2026",
      about: "Qui suis-je",
      rights: "Tous droits réservés",
      events: "Prochains ATHX en France",
    };

export default function Footer() {
  const site = getSite();
  const pages = getAllPages();
  const events = getAllEvents();
  const hubs = getHubs();

  return (
    <footer>
      <div className="wrap">
        <div className="foot-row">
          <div>
            <Link href="/">{COPY.home}</Link>
            <Link href="/#programme">{COPY.program}</Link>
            <Link href={localPath("/semaine-athx-gratuite")}>{COPY.freeWeek}</Link>
            <Link href={href("/calculateur-1rm")}>{COPY.oneRm}</Link>
            <Link href={href("/calculateur-endurance-zone-athx")}>{COPY.endurance}</Link>
            <Link href={href("/scores-athx")}>{COPY.results}</Link>
            <Link href="/blog">Blog</Link>
            <Link href={href("/qui-suis-je")}>{COPY.about}</Link>
            {site.instagram && (
              <a href={site.instagram} rel="me noopener" target="_blank">
                Instagram
              </a>
            )}
          </div>
          <div>
            © {new Date().getFullYear()} {site.name} — {COPY.rights}
          </div>
        </div>
        {events.length > 0 && (
          <div className="foot-row foot-events">
            <div>
              <span>{COPY.events}</span>
              {events.map((event) => (
                <Link key={event.slug} href={`/${event.slug}`}>
                  {event.menuLabel}
                </Link>
              ))}
            </div>
          </div>
        )}
        {hubs.length > 0 && (
          <div className="foot-row foot-events">
            <div>
              <span>Guides</span>
              {hubs.map((hub) => (
                <Link key={hub.slug} href={guidePath(hub)}>
                  {hub.menuLabel}
                </Link>
              ))}
            </div>
          </div>
        )}
        {pages.length > 0 && (
          <div className="foot-row foot-legal">
            <div>
              {pages.map((page) => (
                <Link key={page.slug} href={`/${page.slug}`}>
                  {page.title}
                </Link>
              ))}
              <ConsentSettingsButton />
            </div>
          </div>
        )}
        <p className="disclaimer">{site.disclaimer}</p>
      </div>
    </footer>
  );
}
