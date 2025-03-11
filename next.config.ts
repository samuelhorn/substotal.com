import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // add www.google.com to the list of image domains
  images: {
    domains: ["www.google.com"],
  },
};

export default nextConfig;
