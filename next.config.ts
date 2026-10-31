import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Photos are resized in the browser, but leave room for gallery uploads.
    serverActions: { bodySizeLimit: "2mb" },
  },
};

export default nextConfig;
