import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",
    images: { unoptimized: true },
    trailingSlash: true,
    basePath: "/withdraw-calc",
};

export default nextConfig;
