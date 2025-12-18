import "server-only";

import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function getD1DB(db: D1Database) {
    return drizzle(db, {
        schema,
        casing: "snake_case",
    });
}
