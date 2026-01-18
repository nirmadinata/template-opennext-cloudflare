/**
 * KV Integration
 *
 * Provides access to Cloudflare KV storage.
 * Server-only: import from "@/integrations/kv/server"
 *
 * @example
 * ```ts
 * import { getKV } from "@/integrations/kv/server";
 *
 * const kv = getKV(env);
 * await kv.set("key", "value");
 * ```
 */

export { getKV } from "./server";
