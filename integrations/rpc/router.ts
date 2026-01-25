import { dashboardAuthRoutes as dashboardAuth } from "@/features/dashboard-auth/server";
import { storageRoutes as storage } from "@/features/storage/server";
import { visitorHomeRoutes as home } from "@/features/visitor-home/server";

/**
 * App Router
 *
 * All feature routers are composed here.
 * Each feature exports its own router from the `server` folder.
 *
 * These endpoints are exposed via RPC at /api/rpc
 */
export const appRouter = {
    // Public routes
    home,

    // Storage routes (presigned URLs)
    storage,

    // Dashboard authentication routes
    dashboardAuth,

    // Add more feature routers here
    // Example: users: usersRouter,
    // Example: settings: settingsRouter,
};

export type AppRouter = typeof appRouter;
