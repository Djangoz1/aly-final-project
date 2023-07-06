/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@lens-protocol"],
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
