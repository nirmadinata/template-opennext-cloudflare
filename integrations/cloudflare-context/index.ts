import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export function getCFContext() {
    return getCloudflareContext({
        async: true,
    });
}
