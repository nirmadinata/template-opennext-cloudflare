import "server-only";

import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function getD1DB(env: CloudflareEnv) {
    return drizzle(env.INTERNAL_DB, {
        schema,
        casing: "snake_case",
    });
}
