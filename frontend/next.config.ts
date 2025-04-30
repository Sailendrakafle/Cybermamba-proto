import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverMinification: true,
  },
  server: {
    port: 6262,
  }
};

export default nextConfig;
