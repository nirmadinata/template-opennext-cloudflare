import { z } from "zod";

import { ROLE_ENUM } from "@/configs/constants";
import { constants } from "@/features/dashboard-auth/lib/constants";
import { users } from "@/integrations/db";
import { base } from "@/integrations/rpc";
import {
    initAuthenticationMiddleware,
    initStorageMiddleware,
    injectHeadersMiddleware,
} from "@/integrations/rpc/base";

const domain = base
    /**
     * register middlewares
     */
    .use(injectHeadersMiddleware)
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
    context: { auth, headers },
}) {
    const session = await auth.api.getSession({
        headers,
    });

    return {
        session: session?.session,
        user: session?.user,
    };
});

export const createFirstUser = domain
    .input(
        z.object({
            email: z.email(),
            username: z
                .string()
                .min(constants.USERNAME_MIN_LENGTH)
                .max(constants.USERNAME_MAX_LENGTH),
            password: z
                .string()
                .min(constants.PASSWORD_MIN_LENGTH)
                .max(constants.PASSWORD_MAX_LENGTH),
        })
    )
    .handler(async function ({
        context: { auth },
        input: { email, password, username: name },
    }) {
        const created = await auth.api.createUser({
            body: {
                role: ROLE_ENUM.SUPERADMIN,
                email,
                name,
                password,
            },
        });

        return {
            user: created.user,
        };
    });
