import { getSite } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const { url } = getSite();
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/merci" },
    sitemap: `${url}/sitemap.xml`,
  };
}
