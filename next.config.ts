import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // add www.google.com to the list of image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  }
};

export default nextConfig;
