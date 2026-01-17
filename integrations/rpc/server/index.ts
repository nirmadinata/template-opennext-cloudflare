import "server-only";

import { createRouterClient } from "@orpc/server";

import { appRouter } from "../router";

/**
 * Server-side RPC client
 *
 * Use this client for server components, server actions, and API routes.
 * Calls procedures directly without HTTP overhead.
 *
 * @example
 * ```ts
 * import { serverRpc } from "@/integrations/rpc/server";
 *
 * const data = await serverRpc.home.getHomePageData();
 * ```
 */
export const serverRpc = createRouterClient(appRouter, {
    context: {},
});
