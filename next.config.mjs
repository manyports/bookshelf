/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Add this to ignore other build errors
  experimental: {
    forceSwcTransforms: true,
  },
  webpack: (config) => {
    // Existing webpack configuration
    config.resolve.alias.canvas = false;

    return config;
  },
};

export default nextConfig;
