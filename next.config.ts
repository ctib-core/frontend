import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence warnings for external packages
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  
  // Enable experimental features for better MiniKit support
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
