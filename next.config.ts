import type { NextConfig } from "next";

import nextBundleAnalyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const env = process.env.NEXTJS_ENV;
const isDevelopment = env === "development";
const assetHostName = URL.parse(
    process.env.NEXT_PUBLIC_ASSET_URL ?? ""
)?.hostname;

const nextConfig: NextConfig = {
    /**
     * make sure meta tags is not placed inside body tag
     */
    htmlLimitedBots: /.*/,
    images: {
        loader: isDevelopment ? "default" : "default",
        loaderFile: "./lib/image-loader.ts",
        formats: ["image/webp"],
        remotePatterns: [
            assetHostName && {
                /**
                 * Use hostname from environment variable NEXT_PUBLIC_ASSET_URL
                 */
                hostname: assetHostName,
            },
        ].filter((v) => !!v),
    },
};

const withNextIntl = createNextIntlPlugin({
    requestConfig: "./integrations/i18n/lib/request.ts",
});

const withBundleAnalyzer = nextBundleAnalyzer({
    enabled: process.env.ANALYZE === "1",
});

export default withBundleAnalyzer(withNextIntl(nextConfig));

/**
 * Initialize OpenNext Cloudflare for development environment.
 */
initOpenNextCloudflareForDev({
    environment: process.env.NEXTJS_ENV,
});
