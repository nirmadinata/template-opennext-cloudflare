import "server-only";

import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

function createInternalDB(env: CloudflareEnv) {
    return drizzle(env.INTERNAL_DB, {
        schema,
        casing: "snake_case",
    });
}

type InternalDB = Awaited<ReturnType<typeof createInternalDB>>;

let internalDB: InternalDB | null = null;

export function getInternalDB(env: CloudflareEnv) {
    if (!internalDB) {
        internalDB = createInternalDB(env);
    }

    return internalDB;
}
