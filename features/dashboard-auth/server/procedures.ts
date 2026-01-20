import { onboardFirstTimeSchema } from "@/features/dashboard-auth/server/schemas";
import { base } from "@/integrations/rpc";
import { initAuthenticationMiddleware } from "@/integrations/rpc/base";

const domain = base
    /**
     * register middlewares
     */
    .use(initAuthenticationMiddleware);

export const onboardFirstTime = domain
    .input(onboardFirstTimeSchema.input)
    .output(onboardFirstTimeSchema.output)
    .handler(async ({}) => {
        // TODO: implement the procedure logic here

        return;
    });
