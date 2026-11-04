import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  transpilePackages: ['@uk-immigration/engine', '@uk-immigration/policy-data'],
};

export default nextConfig;
