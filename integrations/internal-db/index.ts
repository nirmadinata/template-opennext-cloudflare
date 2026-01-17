/**
 * Internal Database Integration
 *
 * Provides access to Cloudflare D1 database via Drizzle ORM.
 * Server-only: import from "@/integrations/internal-db/server"
 * Shared (schema, constants): import from "@/integrations/internal-db"
 *
 * @example
 * ```ts
 * import { getInternalDB } from "@/integrations/internal-db/server";
 * import { users } from "@/integrations/internal-db/schema";
 *
 * const db = getInternalDB(env);
 * const allUsers = await db.select().from(users);
 * ```
 */

// Re-export for backward compatibility (will be removed in future)
export { getInternalDB } from "./server";
