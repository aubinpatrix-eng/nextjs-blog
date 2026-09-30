import ConsentBanner from "@/app/_components/consent-banner";
import Footer from "@/app/_components/footer";
import { CONSENT_KEY } from "@/lib/consent";
import Nav from "@/app/_components/nav";
import { getAllEvents } from "@/lib/events";
import { getHubs, guidePath } from "@/lib/guides";
import { formatPrice, getSite } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders_Display, Work_Sans } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const GA_ID = "G-WE18XJYVCK";

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--ff-display",
});
const body = Work_Sans({ subsets: ["latin"], variable: "--ff-body" });

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${site.title}`, template: `%s | ${site.name}` },
    description: site.description,
    openGraph: { type: "website", locale: "fr_FR", siteName: site.name },
    twitter: { card: "summary_large_image" },
  };
}

export const viewport: Viewport = {
  themeColor: "#14140f",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = getSite();

  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
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
          menus={[
            {
              id: "guides",
              label: "Guides",
              title: "Préparer l'ATHX",
              items: getHubs().map((hub) => ({ href: guidePath(hub), label: hub.menuLabel, hint: hub.kicker })),
            },
            {
              id: "competitions",
              label: "Compétitions",
              title: "Prochains ATHX en France",
              items: getAllEvents().map((event) => ({
                href: `/${event.slug}`,
                label: `ATHX ${event.city}`,
                hint: event.dates,
              })),
            },
            {
              id: "calculateurs",
              label: "Calculateurs",
              title: "Outils gratuits",
              items: [
                { href: "/calculateur-1rm", label: "Calculateur 1RM", hint: "Strength zone : 1RM, 2RM, 3RM" },
                { href: "/calculateur-endurance-zone-athx", label: "Calculateur Endurance zone", hint: "Mètres de SkiErg après 3 km" },
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
