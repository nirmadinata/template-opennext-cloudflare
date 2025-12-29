import { toNextJsHandler } from "better-auth/next-js";

import { getCFContextSync } from "@/integrations/cloudflare-context";
import { getAuth } from "@/integrations/internal-auth/server";

export const { GET, POST } = toNextJsHandler(async (request) =>
    getAuth(getCFContextSync().env).handler(request)
);
