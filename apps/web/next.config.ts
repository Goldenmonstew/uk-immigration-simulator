import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  transpilePackages: ['@uk-immigration/engine'],
};

export default nextConfig;
