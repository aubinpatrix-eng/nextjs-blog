/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      // Downloadable files (free week PDF) are subscriber rewards: keep them out of search results.
      { source: "/downloads/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
  async redirects() {
    return [
      // The Strength zone article moved into the Workouts ATHX 2027 guide.
      { source: "/blog/strength-zone-athx-2027", destination: "/workouts-athx-2027/strength-zone", permanent: true },
    ];
  },
};
