import "client-only";

import { createAuthClient } from "better-auth/client";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

import { APP_PATH } from "../constants";
import { type AuthType } from "../server";
import { ac, ROLES } from "@/integrations/auth/roles";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    basePath: APP_PATH,
    plugins: [
        adminClient({
            ac,
            roles: ROLES,
        }),
        inferAdditionalFields<AuthType>(),
    ],
});
