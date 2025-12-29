import "client-only";

import { createAuthClient } from "better-auth/client";
import { adminClient, inferAdditionalFields } from "better-auth/client/plugins";

import { APP_PATH } from "@/integrations/internal-auth/constants";
import { AuthType } from "@/integrations/internal-auth/server";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    basePath: APP_PATH,
    plugins: [adminClient(), inferAdditionalFields<AuthType>()],
});
