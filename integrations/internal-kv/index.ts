/**
 * Internal KV Integration
 *
 * Provides access to Cloudflare KV storage.
 * Server-only: import from "@/integrations/internal-kv/server"
 *
 * @example
 * ```ts
 * import { getInternalKV } from "@/integrations/internal-kv/server";
 *
 * const kv = getInternalKV(env);
 * await kv.put("key", "value");
 * ```
 */

// Re-export for backward compatibility (will be removed in future)
export { getInternalKV } from "./server";
