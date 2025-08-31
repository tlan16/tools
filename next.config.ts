import type {NextConfig} from "next";

import generated from "@next/bundle-analyzer";

const withBundleAnalyzer = generated({
  enabled: true,
})

const nextConfig: NextConfig = {
  output: 'export',
  experimental: {
    turbopackPersistentCaching: true,
  }
};

export default withBundleAnalyzer(nextConfig);
