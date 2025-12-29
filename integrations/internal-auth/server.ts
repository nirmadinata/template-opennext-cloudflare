import "server-only";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { admin, openAPI } from "better-auth/plugins";

import { APP_NAME, APP_PATH } from "@/integrations/internal-auth/constants";
import { getD1DB } from "@/integrations/internal-db";
import { getInternalKV } from "@/integrations/internal-kv";

export function getAuth(env: CloudflareEnv) {
    const db = getD1DB(env);
    const kv = getInternalKV(env);

    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite",
        }),

        appName: APP_NAME,
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        secret: process.env.BETTER_AUTH_SECRET,
        basePath: APP_PATH,

        socialProviders: {
            google: {
                enabled: true,
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
        },
        secondaryStorage: {
            delete: kv.delete,
            get: kv.get,
            set: (k, v, ttl) =>
                kv.put(k, v, ttl ? { expirationTtl: ttl } : undefined),
        },
        emailAndPassword: {
            enabled: true,
            disableSignUp: true,
        },
        session: {
            cookieCache: {
                enabled: true,
            },
        },

        plugins: [
            /**
             * OpenAPI Plugin
             */
            ...(process.env.NEXTJS_ENV !== "production" ? [openAPI()] : []),

            /**
             * Admin Plugin
             */
            admin(),
        ],
    });
}

export type AuthType = Awaited<ReturnType<typeof getAuth>>;
