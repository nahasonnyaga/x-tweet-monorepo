import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/** @type {import('next').NextConfig} */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,       // use SWC (WASM) minifier
  experimental: {},      // keep empty to remove deprecated warnings
  webpack: (config) => {
    // Add alias for @lib
    config.resolve.alias['@lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  }
};

export default nextConfig;
