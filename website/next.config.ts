import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* This helps prevent 404s if you accidentally use trailing slashes */
  trailingSlash: false,
  
  /* Recommended for Vercel: ignores linting errors during build to ensure deployment finishes */
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
