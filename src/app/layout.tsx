import Footer from "@/app/_components/footer";
import Nav from "@/app/_components/nav";
import { getAllEvents } from "@/lib/events";
import { formatPrice, getSite } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Big_Shoulders_Display, Work_Sans } from "next/font/google";

import "./globals.css";

const display = Big_Shoulders_Display({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--ff-display",
});
const body = Work_Sans({ subsets: ["latin"], variable: "--ff-body" });

export function generateMetadata(): Metadata {
  const site = getSite();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${site.title}`, template: `%s | ${site.name}` },
    description: site.description,
    alternates: { canonical: "/" },
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
        <Nav
          priceLabel={formatPrice(site.price)}
          events={getAllEvents().map(({ slug, city, dates }) => ({ slug, city, dates }))}
        />
        {children}
        <Footer />
      </body>
    </html>
  );
}
