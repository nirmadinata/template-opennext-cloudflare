import { storageRouter } from "@/features/storage/server/router";
import { homeRouter } from "@/features/visitor-home/server/router";

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
    home: homeRouter,

    // Storage routes (presigned URLs)
    storage: storageRouter,

    // Add more feature routers here
    // Example: users: usersRouter,
    // Example: settings: settingsRouter,
};

export type AppRouter = typeof appRouter;
