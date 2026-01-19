import { base } from "@/integrations/rpc";
import { initAuthenticationMiddleware } from "@/integrations/rpc/base";

const _domain = base
    /**
     * register middlewares
     */
    .use(initAuthenticationMiddleware);
