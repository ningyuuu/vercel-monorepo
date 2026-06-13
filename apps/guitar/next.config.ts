import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/open-chords",
        destination: "/chords",
        permanent: true,
      },
      {
        source: "/closed-chords",
        destination: "/chords",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
