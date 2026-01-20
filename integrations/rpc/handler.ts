import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";

import { appRouter } from "./router";
import { getCFContext } from "@/integrations/cloudflare-context/server";

/**
 * Create RPC handler for Next.js API routes
 *
 * This handler uses standard ORPC for all endpoints.
 *
 * @returns Handler function for Next.js route
 */
export function createRpcHandler() {
    const handler = new RPCHandler(appRouter, {
        interceptors: [
            onError((error) => {
                console.error("[RPC Error]", error);
            }),
        ],
    });

    return async (request: Request) => {
        const { env } = await getCFContext();
        const { matched, response } = await handler.handle(request, {
            prefix: "/api/rpc",
            context: {
                env,
            },
        });

        if (matched) {
            return response;
        }

        return new Response("Not Found", { status: 404 });
    };
}
