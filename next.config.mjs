/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias['pdf.worker.min'] = false; 
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      use: 'babel-loader',
      exclude: /node_modules\/pdfjs-dist/, 
    });
    config.resolve.alias['canvas'] = false;

    return config;
  },
};

export default nextConfig;
