const routes = require("./src/lib/routes.json");

// The same code base builds the French site (default) and the English site (NEXT_PUBLIC_SITE_LOCALE=en).
const isEn = process.env.NEXT_PUBLIC_SITE_LOCALE === "en";

/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      // Downloadable files (free week PDF) are subscriber rewards: keep them out of search results.
      { source: "/downloads/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  async redirects() {
    if (isEn) {
      // French URLs of fixed routes and categories point to their English address.
      return [
        ...Object.entries(routes.staticRoutes).map(([fr, en]) => ({ source: fr, destination: en, permanent: true })),
        ...Object.entries(routes.tagSlugs)
          .filter(([fr, en]) => fr !== en)
          .map(([fr, en]) => ({ source: `/blog/categorie/${fr}`, destination: `/blog/category/${en}`, permanent: true })),
        { source: "/blog/categorie/:tag", destination: "/blog/category/:tag", permanent: true },
      ];
    }
    return [
      // The Strength zone article moved into the Workouts ATHX 2027 guide.
      { source: "/blog/strength-zone-athx-2027", destination: "/workouts-athx-2027/strength-zone", permanent: true },
    ];
  },
  async rewrites() {
    if (!isEn) return [];
    // English addresses served by the (French-named) route folders.
    return [
      ...Object.entries(routes.staticRoutes).map(([fr, en]) => ({ source: en, destination: fr })),
      { source: "/blog/category/:tag", destination: "/blog/categorie/:tag" },
    ];
  },
};
