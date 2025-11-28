/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Disable SWC → forces Babel (required for Termux)
  swcMinify: false,

  // ✅ Optional: Improve compatibility
  experimental: {
    workerThreads: false,
    cpus: 1,
  },

  reactStrictMode: true,
};

export default nextConfig;
