import type {NextConfig} from "next";

import generated from "@next/bundle-analyzer";

const withBundleAnalyzer = generated({
  enabled: process.env.NODE_ENV === 'production',
  openAnalyzer: process.env.NODE_ENV === 'production',
})

const nextConfig = {
  webpack: (
    config,
    {webpack, nextRuntime}
  ) => {
    if (nextRuntime !== 'edge' && nextRuntime !== 'nodejs')
      console.log(`webpack version: ${webpack.version}`)
    if (!config.experiments) {
      config.experiments = {}
    }
    config.experiments['topLevelAwait'] = true
    return config
  },
  experimental: {
    forceSwcTransforms: false,
  },
  cleanDistDir: true,
} satisfies NextConfig;

export default withBundleAnalyzer(nextConfig);
