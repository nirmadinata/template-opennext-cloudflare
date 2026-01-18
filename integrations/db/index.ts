/**
 * Database Integration
 *
 * Provides access to Cloudflare D1 database via Drizzle ORM.
 * Server-only: import from "@/integrations/db/server"
 * Shared (schema, constants): import from "@/integrations/db"
 *
 * @example
 * ```ts
 * import { getDB } from "@/integrations/db/server";
 * import { users } from "@/integrations/db/schema";
 *
 * const db = getDB(env);
 * const allUsers = await db.select().from(users);
 * ```
 */

export * from "./schema";
export * from "./constants";
