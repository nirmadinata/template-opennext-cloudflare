/**
 * Cloudflare Context Integration
 *
 * Provides access to Cloudflare bindings (D1, KV, R2, etc.)
 * Server-only: import from "@/integrations/cloudflare-context/server"
 *
 * @example
 * ```ts
 * import { getCFContext, getCFContextSync } from "@/integrations/cloudflare-context/server";
 *
 * // Async context (server actions, route handlers)
 * const { env } = await getCFContext();
 *
 * // Sync context (middleware)
 * const { env } = getCFContextSync();
 * ```
 */

// Re-export for backward compatibility (will be removed in future)
export { getCFContext, getCFContextSync } from "./server";
