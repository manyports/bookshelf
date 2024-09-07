/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production', 
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5, 
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false; 
    return config;
  },
};

export default nextConfig;
