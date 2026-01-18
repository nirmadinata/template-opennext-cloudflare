import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@/integrations/auth/server";
import { getCFContextSync } from "@/integrations/cloudflare-context/server";

export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(
    async (request) => getAuth(getCFContextSync().env).handler(request)
);
