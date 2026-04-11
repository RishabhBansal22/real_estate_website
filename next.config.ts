import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ['image/webp', 'image/avif'], // Modern formats for faster loading
  },
  compress: true, // Enable gzip compression
  productionBrowserSourceMaps: false, // Disable source maps in production
  //swcMinify: true, // Use SWC minifier for faster builds
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'], // Optimize specific packages
  },
};

export default nextConfig;
