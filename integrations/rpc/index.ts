/**
 * RPC Integration
 *
 * Centralized ORPC infrastructure for all API endpoints.
 *
 * Usage:
 * - Server components: import { serverRpc } from "@/integrations/rpc/server"
 * - Client components: import { orpc, clientRpc } from "@/integrations/rpc/client"
 * - Procedures: import { publicProcedure } from "@/integrations/rpc"
 * - Handler: import { createRpcHandler } from "@/integrations/rpc"
 */

export { createRpcHandler } from "./handler";
export { base } from "./base";
export type { AppRouter } from "./router";
