import type {NextConfig} from "next";

import generated from "@next/bundle-analyzer";

const withBundleAnalyzer = generated({
  enabled: true,
})

const nextConfig: NextConfig = {
  experimental: {
    turbopackPersistentCaching: true,
  }
};

export default withBundleAnalyzer(nextConfig);
