import type {NextConfig} from "next";

import generated from "@next/bundle-analyzer";

const withBundleAnalyzer = generated({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // Only set basePath for production GitHub Pages deployment
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/tools',
    assetPrefix: '/tools',
  }),
  experimental: {
    turbopackPersistentCaching: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-separator', '@radix-ui/react-slot', '@radix-ui/react-tooltip'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimize images and assets for static export
  images: {
    unoptimized: true, // Required for static export
  },
  // Modern JavaScript target
  transpilePackages: [],
  swcMinify: true,
  // Generate static files with proper naming for better caching
  generateEtags: false,
  poweredByHeader: false,
  // Optimize static asset generation
  distDir: 'out',
};

export default withBundleAnalyzer(nextConfig);
