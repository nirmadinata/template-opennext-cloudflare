import { toNextJsHandler } from "better-auth/next-js";

import { getCFContextSync } from "@/integrations/cloudflare-context/server";
import { getAuth } from "@/integrations/internal-auth/server";

export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(
    async (request) => getAuth(getCFContextSync().env).handler(request)
);
