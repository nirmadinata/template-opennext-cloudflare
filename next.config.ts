import type { NextConfig } from "next";

import nextBundleAnalyzer from "@next/bundle-analyzer";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    /**
     * make sure meta tags is not placed inside body tag
     */
    htmlLimitedBots: /.*/,
    images: {
        formats: ["image/webp"],
        remotePatterns: [
            {
                /**
                 * Use hostname from environment variable NEXT_PUBLIC_ASSET_URL
                 */
                hostname: new URL(process.env.NEXT_PUBLIC_ASSET_URL || "")
                    .hostname,
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin(
    // Specify a custom path here
    {
        requestConfig: "./adapters/i18n/lib/request.ts",
    }
);

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
