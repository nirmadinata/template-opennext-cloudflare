/**
 * Internationalization Integration
 *
 * Provides locale management for the application.
 * Server-only: import from "@/integrations/i18n/server"
 *
 * @example
 * ```ts
 * import { getUserLocale, setUserLocale } from "@/integrations/i18n/server";
 *
 * const locale = await getUserLocale();
 * await setUserLocale("ar");
 * ```
 */

// Re-export for backward compatibility (will be removed in future)
export { getUserLocale, setUserLocale, onChangeLocale } from "./server";
