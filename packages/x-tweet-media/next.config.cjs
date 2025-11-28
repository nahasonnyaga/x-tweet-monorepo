/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,          // disable SWC minifier
  experimental: {
    forceSwcTransforms: false // SUPER IMPORTANT: disables the SWC requirement
  },
  compiler: {
    // use Babel instead of SWC
    emotion: false,
  }
};

module.exports = nextConfig;
