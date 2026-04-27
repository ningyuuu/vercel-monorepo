import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui"],
  turbopack: {
    resolveAlias: {
      "components/ui": "../../packages/ui/src/components/ui",
      "components/ui/button": "../../packages/ui/src/components/ui/button.tsx",
    },
  },
};

export default nextConfig;
