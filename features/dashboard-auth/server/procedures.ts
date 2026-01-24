import { z } from "zod";

import { users } from "@/integrations/db";
import { base } from "@/integrations/rpc";
import {
    initAuthenticationMiddleware,
    initStorageMiddleware,
} from "@/integrations/rpc/base";

const domain = base
    /**
     * register middlewares
     */
    .use(initAuthenticationMiddleware)
    .use(initStorageMiddleware);

export const checkIsFirstTimeUser = domain
    .output(
        z.object({
            value: z.boolean(),
        })
    )
    .handler(async function ({ context: { db } }) {
        const total = await db.$count(users);

        return {
            value: total === 0,
        };
    });
