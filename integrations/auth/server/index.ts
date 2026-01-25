import "server-only";

import { DB, drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { admin, openAPI } from "better-auth/plugins";

import { DEFAULT_CREATED_ROLE, ROLE_ENUM } from "@/configs/constants";
import {
    APP_NAME,
    APP_PATH,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
} from "@/integrations/auth/constants";
import { ac, ROLES } from "@/integrations/auth/roles";
import { COLUMN_ALIASES, TABLE_ALIASES } from "@/integrations/db/constants";
import { getDB } from "@/integrations/db/server";
import { getKV } from "@/integrations/kv/server";

function createAdapter<D extends DB>(db: D) {
    return drizzleAdapter(db, {
        provider: "sqlite",
    });
}

let adapter: ReturnType<typeof createAdapter> | null = null;

function getAdapter<D extends DB>(db: D) {
    adapter ??= createAdapter(db);
    return adapter;
}

function createAuth(env: CloudflareEnv) {
    const db = getDB(env);
    const secondaryStorage = getKV(env);
    const database = getAdapter(db);

    return betterAuth({
        database,
        secondaryStorage,

        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        secret: process.env.BETTER_AUTH_SECRET,

        appName: APP_NAME,
        basePath: APP_PATH,
        socialProviders: {
            google: {
                prompt: "select_account",
                disableSignUp: true,
                enabled: true,
                clientId: process.env.GOOGLE_CLIENT_ID!,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            },
        },
        emailAndPassword: {
            enabled: true,
            disableSignUp: true,
            maxPasswordLength: MAX_PASSWORD_LENGTH,
            minPasswordLength: MIN_PASSWORD_LENGTH,
        },
        user: {
            modelName: TABLE_ALIASES.USERS,
            fields: {
                name: COLUMN_ALIASES.USERS.NAME,
                email: COLUMN_ALIASES.USERS.EMAIL,
                emailVerified: COLUMN_ALIASES.USERS.EMAIL_VERIFIED,
                image: COLUMN_ALIASES.USERS.IMAGE,

                createdAt: COLUMN_ALIASES.COMMON_COLUMNS.CREATED_AT,
                updatedAt: COLUMN_ALIASES.COMMON_COLUMNS.UPDATED_AT,
            },
        },
        account: {
            modelName: TABLE_ALIASES.ACCOUNTS,
            fields: {
                accessToken: COLUMN_ALIASES.ACCOUNTS.ACCESS_TOKEN,
                refreshToken: COLUMN_ALIASES.ACCOUNTS.REFRESH_TOKEN,
                accessTokenExpiresAt:
                    COLUMN_ALIASES.ACCOUNTS.ACCESS_TOKEN_EXPIRES_AT,
                refreshTokenExpiresAt:
                    COLUMN_ALIASES.ACCOUNTS.REFRESH_TOKEN_EXPIRES_AT,
                idToken: COLUMN_ALIASES.ACCOUNTS.ID_TOKEN,
                scope: COLUMN_ALIASES.ACCOUNTS.SCOPE,
                password: COLUMN_ALIASES.ACCOUNTS.PASSWORD,
                accountId: COLUMN_ALIASES.ACCOUNTS.ACCOUNT_ID,
                providerId: COLUMN_ALIASES.ACCOUNTS.PROVIDER_ID,
                userId: COLUMN_ALIASES.ACCOUNTS.USER_ID,

                createdAt: COLUMN_ALIASES.COMMON_COLUMNS.CREATED_AT,
                updatedAt: COLUMN_ALIASES.COMMON_COLUMNS.UPDATED_AT,
            },
        },
        verification: {
            modelName: TABLE_ALIASES.VERIFICATIONS,
            fields: {
                identifier: COLUMN_ALIASES.VERIFICATIONS.IDENTIFIER,
                value: COLUMN_ALIASES.VERIFICATIONS.VALUE,
                expiresAt: COLUMN_ALIASES.VERIFICATIONS.EXPIRES_AT,

                createdAt: COLUMN_ALIASES.COMMON_COLUMNS.CREATED_AT,
                updatedAt: COLUMN_ALIASES.COMMON_COLUMNS.UPDATED_AT,
            },
        },
        session: {
            cookieCache: {
                enabled: true,
            },
            modelName: TABLE_ALIASES.SESSIONS,
            fields: {
                createdAt: COLUMN_ALIASES.COMMON_COLUMNS.CREATED_AT,
                updatedAt: COLUMN_ALIASES.COMMON_COLUMNS.UPDATED_AT,

                userId: COLUMN_ALIASES.SESSIONS.USER_ID,
                token: COLUMN_ALIASES.SESSIONS.TOKEN,
                expiresAt: COLUMN_ALIASES.SESSIONS.EXPIRES_AT,
                ipAddress: COLUMN_ALIASES.SESSIONS.IP_ADDRESS,
                userAgent: COLUMN_ALIASES.SESSIONS.USER_AGENT,
            },
        },

        plugins: [
            /**
             * OpenAPI Plugin (development only)
             */
            ...(process.env.NEXTJS_ENV === "production" ? [] : [openAPI()]),

            /**
             * Admin Plugin
             */
            admin({
                roles: ROLES,
                defaultRole: DEFAULT_CREATED_ROLE,
                ac: ac,
                adminRoles: [
                    ROLE_ENUM.SYSTEM,
                    ROLE_ENUM.SUPERADMIN,
                    ROLE_ENUM.ADMIN,
                ],
                schema: {
                    session: {
                        modelName: TABLE_ALIASES.SESSIONS,
                        fields: {
                            impersonatedBy:
                                COLUMN_ALIASES.SESSIONS.IMPERSONATED_BY,
                        },
                    },
                    user: {
                        modelName: TABLE_ALIASES.USERS,
                        fields: {
                            role: COLUMN_ALIASES.USERS.ROLE,
                            banned: COLUMN_ALIASES.USERS.BANNED,
                            banReason: COLUMN_ALIASES.USERS.BAN_REASON,
                            banExpires: COLUMN_ALIASES.USERS.BAN_EXPIRES,
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
