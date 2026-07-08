import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // /cars/* photography is served from Cloudinary (see tools/cloudinary-upload.mjs)
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
