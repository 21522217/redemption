import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /next-dev\.js$/,
      });
    }
    return config;
  },
};

export default nextConfig;
