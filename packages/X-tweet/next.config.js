/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'], // allow Cloudinary images
  },
  eslint: {
    ignoreDuringBuilds: true, // skip lint errors during build
  },
  // ✅ Replace experimental.turbo with turbopack
  turbopack: {
    rules: {}, // optional, only if you had rules
  },
};

module.exports = nextConfig;
