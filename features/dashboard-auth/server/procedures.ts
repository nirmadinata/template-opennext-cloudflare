import {
    createFirstUserInputSchema,
    isFirstUserResponseSchema,
} from "./schemas";
import { ROLE_ENUM } from "@/configs/constants";
import { users } from "@/integrations/db";
import { base } from "@/integrations/rpc";
import {
    initAuthenticationMiddleware,
    initStorageMiddleware,
    injectHeadersMiddleware,
} from "@/integrations/rpc/base";

const domain = base
    /**
     * Register middlewares for dashboard auth procedures
     */
    .use(injectHeadersMiddleware)
    .use(initAuthenticationMiddleware)
    .use(initStorageMiddleware);

/**
 * Check if this is the first user setup
 *
 * Returns true if no users exist in the database.
 */
export const checkIsFirstTimeUser = domain
    .output(isFirstUserResponseSchema)
    .handler(async function ({ context: { db } }) {
        const total = await db.$count(users);

        return {
            value: total === 0,
        };
    });

/**
 * Get current auth session
 *
 * Returns the current user's session and user data if authenticated.
 */
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

/**
 * Create the first admin user
 *
 * Creates a superadmin user during initial setup.
 * Should only be called when no users exist.
 */
export const createFirstUser = domain
    .input(createFirstUserInputSchema)
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
