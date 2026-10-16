import ConsentBanner from "@/app/_components/consent-banner";
import Footer from "@/app/_components/footer";
import { CONSENT_KEY } from "@/lib/consent";
import Nav from "@/app/_components/nav";
import { getAllEvents } from "@/lib/events";
import { getHubs, guidePath } from "@/lib/guides";
import { absoluteUrl, href, isEn, LOCALE, OG_LOCALE, STATIC_ROUTES } from "@/lib/i18n";
import { localPath } from "@/lib/paths";
import { formatPrice, getSite } from "@/lib/site";
import { sitemapEntries } from "@/lib/sitemap-entries";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders_Display, Work_Sans } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const GA_ID = "G-WE18XJYVCK";
const OTHER = LOCALE === "fr" ? "en" : "fr";

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--ff-display",
});
const body = Work_Sans({ subsets: ["latin"], variable: "--ff-body" });

const COPY = isEn
  ? {
      guides: "Guides",
      guidesTitle: "Prepare for ATHX",
      competitions: "Competitions",
      competitionsTitle: "Upcoming ATHX in France",
      tools: "Tools",
      toolsTitle: "Free tools",
      oneRm: ["1RM calculator", "Strength zone: 1RM, 2RM, 3RM"],
      endurance: ["Endurance zone calculator", "SkiErg metres after a 3 km run"],
      results: ["ATHX 2026 results", "Scores by level, Paris and Marseille"],
    }
  : {
      guides: "Guides",
      guidesTitle: "Préparer l'ATHX",
      competitions: "Compétitions",
      competitionsTitle: "Prochains ATHX en France",
      tools: "Outils",
      toolsTitle: "Outils gratuits",
      oneRm: ["Calculateur 1RM", "Strength zone : 1RM, 2RM, 3RM"],
      endurance: ["Calculateur Endurance zone", "Mètres de SkiErg après 3 km"],
      results: ["Résultats ATHX 2026", "Les scores par niveau, Paris et Marseille"],
    };

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${site.title}`, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: { type: "website", locale: OG_LOCALE[LOCALE], alternateLocale: OG_LOCALE[OTHER], siteName: site.name },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#14140f",
  viewportFit: "cover",
};

// Same page on the other-language site, for the language switch in the header.
function languageSwitchMap() {
  const map: Record<string, string> = {};
  for (const { paths } of sitemapEntries()) {
    const own = paths[LOCALE];
    const other = paths[OTHER];
    if (own && other) map[own] = absoluteUrl(other, OTHER);
  }
  // Fixed routes left out of the sitemap (thank-you pages).
  for (const [fr, en] of Object.entries(STATIC_ROUTES)) {
    const [own, other] = isEn ? [en, fr] : [fr, en];
    map[own] ??= absoluteUrl(other, OTHER);
  }
  return map;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSite();

  return (
    <html lang={LOCALE} className={`${display.variable} ${body.variable}`}>
      <body>
        {/* Google tag (gtag.js), loaded after hydration. Analytics storage stays denied until the visitor accepts. */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
var c=null;try{c=localStorage.getItem('${CONSENT_KEY}');}catch(e){}
gtag('consent','default',{analytics_storage:c==='granted'?'granted':'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
        <Nav
          priceLabel={formatPrice(site.price)}
          freeWeekHref={localPath("/semaine-athx-gratuite")}
          switchMap={languageSwitchMap()}
          switchHome={absoluteUrl("/", OTHER)}
          menus={[
            {
              id: "guides",
              label: COPY.guides,
              title: COPY.guidesTitle,
              items: getHubs().map((hub) => ({ href: guidePath(hub), label: hub.menuLabel, hint: hub.kicker })),
            },
            {
              id: "competitions",
              label: COPY.competitions,
              title: COPY.competitionsTitle,
              items: getAllEvents().map((event) => ({
                href: `/${event.slug}`,
                label: `ATHX ${event.city}`,
                hint: event.dates,
              })),
            },
            {
              id: "outils",
              label: COPY.tools,
              title: COPY.toolsTitle,
              items: [
                { href: href("/calculateur-1rm"), label: COPY.oneRm[0], hint: COPY.oneRm[1] },
                { href: href("/calculateur-endurance-zone-athx"), label: COPY.endurance[0], hint: COPY.endurance[1] },
                { href: href("/scores-athx"), label: COPY.results[0], hint: COPY.results[1] },
              ],
            },
          ]}
        />
        {children}
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
