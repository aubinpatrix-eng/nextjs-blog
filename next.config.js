/** @type {import('next').NextConfig} */
module.exports = {
  async redirects() {
    return [
      // The Strength zone article moved into the Workouts ATHX 2027 guide.
      { source: "/blog/strength-zone-athx-2027", destination: "/workouts-athx-2027/strength-zone", permanent: true },
    ];
  },
};
