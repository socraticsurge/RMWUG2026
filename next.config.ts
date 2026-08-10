import type { NextConfig } from "next";

const isPagesBuild = process.env.PAGES_BUILD === "true";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  distDir: isPagesBuild ? ".next-pages" : ".next",
  ...(isPagesBuild
    ? {
        basePath: "/RMWUG2026",
        assetPrefix: "/RMWUG2026/",
      }
    : {}),
};

export default nextConfig;
