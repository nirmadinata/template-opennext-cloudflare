import "server-only";

import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { admin, openAPI } from "better-auth/plugins";

import {
    APP_NAME,
    APP_PATH,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
} from "../constants";
import {
    ACCOUNT_COLUMN_ENUM,
    COMMON_COLUMN_ENUM,
    SESSION_COLUMN_ENUM,
    TABLE_ENUM,
    USER_COLUMN_ENUM,
    VERIFICATION_COLUMN_ENUM,
} from "@/integrations/internal-db/constants";
import { getInternalDB } from "@/integrations/internal-db/server";
import { getInternalKV } from "@/integrations/internal-kv/server";

function createAuth(env: CloudflareEnv) {
    const db = getInternalDB(env);
    const kv = getInternalKV(env);

    const database = drizzleAdapter(db, {
        provider: "sqlite",
        usePlural: true,
    });

    return betterAuth({
        database,

        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        secret: process.env.BETTER_AUTH_SECRET,

        appName: APP_NAME,
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
            get: (k) => kv.get(k),
            set: (k, v, ttl) =>
                kv.put(k, v, ttl ? { expirationTtl: ttl } : undefined),
        },
        emailAndPassword: {
            enabled: true,
            disableSignUp: true,
            maxPasswordLength: MAX_PASSWORD_LENGTH,
            minPasswordLength: MIN_PASSWORD_LENGTH,
        },
        user: {
            modelName: TABLE_ENUM.USERS,
            fields: {
                name: USER_COLUMN_ENUM.NAME,
                email: USER_COLUMN_ENUM.EMAIL,
                emailVerified: USER_COLUMN_ENUM.EMAIL_VERIFIED,
                image: USER_COLUMN_ENUM.IMAGE,

                createdAt: COMMON_COLUMN_ENUM.CREATED_AT,
                updatedAt: COMMON_COLUMN_ENUM.UPDATED_AT,
            },
        },
        account: {
            modelName: TABLE_ENUM.ACCOUNTS,
            fields: {
                accessToken: ACCOUNT_COLUMN_ENUM.ACCESS_TOKEN,
                refreshToken: ACCOUNT_COLUMN_ENUM.REFRESH_TOKEN,
                accessTokenExpiresAt:
                    ACCOUNT_COLUMN_ENUM.ACCESS_TOKEN_EXPIRES_AT,
                refreshTokenExpiresAt:
                    ACCOUNT_COLUMN_ENUM.REFRESH_TOKEN_EXPIRES_AT,
                idToken: ACCOUNT_COLUMN_ENUM.ID_TOKEN,
                scope: ACCOUNT_COLUMN_ENUM.SCOPE,
                password: ACCOUNT_COLUMN_ENUM.PASSWORD,
                accountId: ACCOUNT_COLUMN_ENUM.ACCOUNT_ID,
                providerId: ACCOUNT_COLUMN_ENUM.PROVIDER_ID,
                userId: ACCOUNT_COLUMN_ENUM.USER_ID,
                createdAt: COMMON_COLUMN_ENUM.CREATED_AT,
                updatedAt: COMMON_COLUMN_ENUM.UPDATED_AT,
            },
        },
        verification: {
            modelName: TABLE_ENUM.VERIFICATIONS,
            fields: {
                identifier: VERIFICATION_COLUMN_ENUM.IDENTIFIER,
                value: VERIFICATION_COLUMN_ENUM.VALUE,
                expiresAt: VERIFICATION_COLUMN_ENUM.EXPIRES_AT,
                createdAt: COMMON_COLUMN_ENUM.CREATED_AT,
                updatedAt: COMMON_COLUMN_ENUM.UPDATED_AT,
            },
        },
        session: {
            cookieCache: {
                enabled: true,
            },
            modelName: TABLE_ENUM.SESSIONS,
            fields: {
                createdAt: COMMON_COLUMN_ENUM.CREATED_AT,
                updatedAt: COMMON_COLUMN_ENUM.UPDATED_AT,
                userId: SESSION_COLUMN_ENUM.USER_ID,
                token: SESSION_COLUMN_ENUM.TOKEN,
                expiresAt: SESSION_COLUMN_ENUM.EXPIRES_AT,
                ipAddress: SESSION_COLUMN_ENUM.IP_ADDRESS,
                userAgent: SESSION_COLUMN_ENUM.USER_AGENT,
            },
        },

        plugins: [
            /**
             * OpenAPI Plugin (development only)
             */
            ...(process.env.NEXTJS_ENV !== "production" ? [openAPI()] : []),

            /**
             * Admin Plugin
             */
            admin({
                schema: {
                    session: {
                        modelName: TABLE_ENUM.SESSIONS,
                        fields: {
                            impersonatedBy: SESSION_COLUMN_ENUM.IMPERSONATED_BY,
                        },
                    },
                    user: {
                        modelName: TABLE_ENUM.USERS,
                        fields: {
                            role: USER_COLUMN_ENUM.ROLE,
                            banned: USER_COLUMN_ENUM.BANNED,
                            banReason: USER_COLUMN_ENUM.BAN_REASON,
                            banExpires: USER_COLUMN_ENUM.BAN_EXPIRES,
                        },
                    },
                },
            }),
        ],
    });
}

export type AuthType = Awaited<ReturnType<typeof createAuth>>;

/**
 * singleton auth instance
 */
let auth: AuthType | null = null;

export function getAuth(env: CloudflareEnv) {
    auth ??= createAuth(env);

    return auth;
}
