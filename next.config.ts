import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ["preview-chat-a0b8d10e-265e-468c-8f69-560827097f9a.space-z.ai"],
};

export default nextConfig;
