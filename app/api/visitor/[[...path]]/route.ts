import { createApiHandler } from "@/integrations/rest";

/**
 * Visitor API Route Handler
 *
 * Handles all visitor-related API endpoints via ORPC.
 * Prefix: /api/visitor
 */
const handler = createApiHandler();

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
export const HEAD = handler;
