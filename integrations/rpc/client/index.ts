"use client";

import type { AppRouter } from "../router";
import type { RouterClient } from "@orpc/server";

import { createORPCClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";

/**
 * RPC Link for client-side requests
 *
 * Uses fetch-based HTTP calls to the RPC endpoints.
 */
const link = new RPCLink({
    url: () => {
        if (typeof window === "undefined") {
            throw new Error(
                "Client RPC client is not allowed on the server side."
            );
        }
        return `${window.location.origin}/api/rpc`;
    },
    interceptors: [
        onError((error) => {
            console.error("[RPC Client Error]", error);
        }),
    ],
});

/**
 * Client-side RPC client
 *
 * Use this client for client components with fetch-based HTTP calls.
 *
 * @example
 * ```ts
 * import { clientRpc } from "@/integrations/rpc/client";
 *
 * const data = await clientRpc.home.getHomePageData();
 * ```
 */
export const clientRpc: RouterClient<AppRouter> = createORPCClient(link);

/**
 * TanStack Query utilities for RPC
 *
 * Use this for React Query integration with type-safe queries and mutations.
 *
 * @example
 * ```tsx
 * import { orpc } from "@/integrations/rpc/client";
 * import { useQuery } from "@tanstack/react-query";
 *
 * const { data } = useQuery(orpc.home.getHomePageData.queryOptions());
 * ```
 */
export const orpc = createTanstackQueryUtils(clientRpc);
