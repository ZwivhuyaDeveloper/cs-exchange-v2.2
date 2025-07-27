/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ]
  }
}

module.exports = {
    ...nextConfig,
    turbopack: { 
      resolveAlias: {
        underscore: 'lodash',
      },
      resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json', '.css'],
    },
}