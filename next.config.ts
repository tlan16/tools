import type {NextConfig} from "next";

import generated from "@next/bundle-analyzer";

const withBundleAnalyzer = generated({
  enabled: process.env.NODE_ENV === 'production',
  openAnalyzer: false,
})

const nextConfig: NextConfig = {
  experimental: {
  },
  cleanDistDir: true,
};

export default withBundleAnalyzer(nextConfig);
