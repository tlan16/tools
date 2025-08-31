import type {NextConfig} from "next";

import generated from "@next/bundle-analyzer";

const withBundleAnalyzer = generated({
  enabled: true,
})

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    turbopackPersistentCaching: true,
  },
  headers: {
    key: 'Cache-Control',
    value: 'public, max-age=31536000, immutable',
  }
};

export default withBundleAnalyzer(nextConfig);
