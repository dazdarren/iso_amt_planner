import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  // Disable static page generation for error pages to avoid React context issues
  output: 'standalone',
};

export default nextConfig;
