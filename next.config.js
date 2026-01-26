/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    turbopack: {
      root: __dirname,
    },
  },
};

module.exports = nextConfig;
