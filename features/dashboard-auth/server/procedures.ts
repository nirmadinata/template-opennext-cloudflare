import { headers } from "next/headers";

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

export const getAuthSession = domain.handler(async function ({
    context: { auth },
}) {
    const header = await headers();
    const session = await auth.api.getSession({
        headers: header,
    });

    return {
        session: session?.session,
        user: session?.user,
    };
});
