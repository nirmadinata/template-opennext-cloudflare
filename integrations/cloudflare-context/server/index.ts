import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getCFContext() {
    return getCloudflareContext({
        async: true,
    });
}

export function getCFContextSync() {
    return getCloudflareContext();
}
