import "client-only";

import type { AuthType } from "../server";

import { createAuthClient } from "better-auth/client";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

import { APP_PATH } from "../constants";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    basePath: APP_PATH,
    plugins: [adminClient(), inferAdditionalFields<AuthType>()],
});
