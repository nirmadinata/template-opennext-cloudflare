import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod";

import { appRouter } from "./router";

/**
 * Create OpenAPI handler for Next.js API routes
 *
 * @param prefix - API route prefix (e.g., "/api/visitor")
 * @returns Handler function for Next.js route
 */
export function createApiHandler() {
    const handler = new OpenAPIHandler(appRouter, {
        plugins: [
            new OpenAPIReferencePlugin({
                schemaConverters: [new ZodToJsonSchemaConverter()],
                specGenerateOptions: {
                    info: {
                        title: "Template APIII",
                        version: "0.1.0",
                    },
                },
            }),
        ],
        interceptors: [
            onError((error) => {
                console.error("[API Error]", error);
            }),
        ],
    });

    return async (request: Request) => {
        const { matched, response } = await handler.handle(request, {
            prefix: "/api/visitor",
            context: {},
        });

        if (matched) {
            return response;
        }

        return new Response("Not Found", { status: 404 });
    };
}
