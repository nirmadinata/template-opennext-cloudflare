import { toNextJsHandler } from "better-auth/next-js";

import { getCFContextSync } from "@/integrations/cloudflare-context";
import { getAuth } from "@/integrations/internal-auth/server";

export const { GET, POST } = toNextJsHandler(async (req) =>
    getAuth(getCFContextSync().env).handler(req)
);
