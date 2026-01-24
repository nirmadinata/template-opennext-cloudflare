import { headers } from "next/headers";

import { os } from "@orpc/server";
import { z } from "zod";

import { getAuth } from "@/integrations/auth/server";
import { getCFContextSync } from "@/integrations/cloudflare-context";
import { getDB } from "@/integrations/db/server";
import { getKV } from "@/integrations/kv";

export const base = os.errors({
    INTERNAL_SERVER_ERROR: {
        message: "An internal server error occurred",
    },

    BAD_REQUEST: {
        message: "The request was invalid or cannot be served",
    },

    UNAUTHORIZED: {
        message: "The request requires user authentication",
    },

    NOT_FOUND: {
        message: "The requested resource could not be found",
    },

    INPUT_VALIDATION_FAILED: {
        status: 422,
        data: z.object({
            formErrors: z.array(z.string()),
            fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
        }),
    },
    OUTPUT_VALIDATION_FAILED: {
        status: 500,
        message: "The server output validation failed",
        data: z.object({
            formErrors: z.array(z.string()),
            fieldErrors: z.record(z.string(), z.array(z.string()).optional()),
        }),
    },
});

/**
 * middlewares
 */

export const injectHeadersMiddleware = base.middleware(
    async ({ context, next }) =>
        next({
            context: {
                ...context,
                headers: await headers(),
            },
        })
);

export const injectCFContextMiddleware = base.middleware(({ context, next }) =>
    next({
        context: {
            ...context,
            cfCtx: getCFContextSync(),
        },
    })
);

export const initStorageMiddleware = injectCFContextMiddleware.concat(
    ({ context, next }) => {
        return next({
            context: {
                ...context,
                kv: getKV(context.cfCtx.env),
                db: getDB(context.cfCtx.env),
            },
        });
    }
);

export const initAuthenticationMiddleware = injectCFContextMiddleware.concat(
    ({ context, next }) => {
        return next({
            context: {
                ...context,
                auth: getAuth(context.cfCtx.env),
            },
        });
    }
);

export const ensureAdminMiddleware = injectHeadersMiddleware
    .concat(initAuthenticationMiddleware)
    .concat(async ({ context, next, errors }) => {
        const session = await context.auth.api.getSession({
            headers: context.headers,
        });

        if (!session?.session) {
            throw errors.UNAUTHORIZED();
        }

        return next({
            context: {
                ...context,
                session: session.session,
                user: session.user,
            },
        });
    });
