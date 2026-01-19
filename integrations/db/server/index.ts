import "server-only";

import { drizzle } from "drizzle-orm/d1";

import * as schema from "../schema";

function createDB(env: CloudflareEnv) {
    return drizzle(env.MAIN_DB, {
        schema,
        casing: "snake_case",
    });
}

type AppDB = Awaited<ReturnType<typeof createDB>>;

let db: AppDB | null = null;

export function getDB(env: CloudflareEnv) {
    db ??= createDB(env);
    return db;
}
