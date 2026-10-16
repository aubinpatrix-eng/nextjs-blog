import { href } from "@/lib/i18n";
import { getSite } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const { url } = getSite();
  return {
    rules: { userAgent: "*", allow: "/", disallow: [href("/merci"), "/api/"] },
    sitemap: `${url}/sitemap.xml`,
  };
}
