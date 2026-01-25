# Integrations

## Purpose

External service wrappers and API clients. Each integration provides a consistent interface to interact with external services like Cloudflare D1, KV, R2, authentication, email, and RPC.

## Structure

```
integrations/
├── AGENTS.md              # This documentation
├── auth/                  # Authentication (better-auth)
│   ├── client/            # Client-side auth helpers
│   ├── server/            # Server-side auth configuration
│   ├── constants.ts       # Auth constants (app name, paths)
│   └── roles.ts           # Role definitions
├── cloudflare-context/    # Cloudflare bindings access
│   ├── index.ts           # Re-exports
│   └── server/            # getCFContext, getCFContextSync
├── db/                    # Database (Drizzle + D1)
│   ├── server/            # getDB singleton
│   ├── schema.ts          # Drizzle schema definitions
│   ├── constants.ts       # Table/column aliases, role lists
│   ├── migrations/        # Generated SQL migrations
│   └── drizzle.config.ts  # Drizzle configuration
├── email/                 # Email sending (Plunk)
│   └── index.ts           # Client initialization
├── i18n/                  # Internationalization (next-intl)
│   ├── server/            # getUserLocale, setUserLocale
│   └── lib/               # Request config, types, utils
├── kv/                    # Cloudflare KV storage
│   └── server/            # getKV
├── r2/                    # Cloudflare R2 storage
│   ├── client/            # Client-side upload utilities
│   ├── server/            # S3 client, R2 binding operations
│   ├── constants.ts       # R2_PATHS, ALLOWED_MIME_TYPES, MAX_FILE_SIZES
│   └── types.ts           # R2 interfaces
└── rpc/                   # ORPC (type-safe RPC)
    ├── client/            # Client-side orpc instance
    ├── server/            # Server-side serverRpc instance
    ├── router.ts          # Main router composition
    ├── base.ts            # Base procedures, middlewares, error definitions
    ├── types.ts           # Context types
    └── handler.ts         # Next.js route handler
```

## Integration Patterns

### Cloudflare Context

Always access Cloudflare bindings through the context wrapper:

```typescript
import {
    getCFContext,
    getCFContextSync,
} from "@/integrations/cloudflare-context/server";

// Async contexts (server actions, route handlers)
const { env } = await getCFContext();

// Sync contexts (middleware)
const { env } = getCFContextSync();
```

### Database (D1 + Drizzle)

```typescript
import { getDB } from "@/integrations/db/server";
import { users } from "@/integrations/db/schema";

const { env } = await getCFContext();
const db = getDB(env);

// Query
const allUsers = await db.select().from(users);
```

### Authentication (better-auth)

```typescript
// Client-side
import { authClient } from "@/integrations/auth/client";
const session = await authClient.getSession();

// Server-side
import { getAuth } from "@/integrations/auth/server";
import { getCFContext } from "@/integrations/cloudflare-context/server";

const { env } = await getCFContext();
const auth = getAuth(env);
const session = await auth.api.getSession({ headers });
```

### KV Storage

```typescript
import { getKV } from "@/integrations/kv/server";

const { env } = await getCFContext();
const kv = getKV(env);

// KV implements better-auth SecondaryStorage interface
await kv.set("key", "value", 60); // 60s TTL
const value = await kv.get("key");
await kv.delete("key");
```

### R2 Storage

```typescript
// Server-side text/JSON storage
import { getR2Storage } from "@/integrations/r2/server";

const { env } = await getCFContext();
const storage = getR2Storage(env);
await storage.setJson("config/settings.json", { theme: "dark" });

// Presigned URLs for client uploads
import { getS3PresignedUrlGenerator } from "@/integrations/r2/server";

const generator = getS3PresignedUrlGenerator();
const { url } = await generator.generateUploadUrl({
    key: "uploads/file.jpg",
    contentType: "image/jpeg",
});
```

### RPC (ORPC)

```typescript
// Server-side (server components, actions)
import { serverRpc } from "@/integrations/rpc/server";
const data = await serverRpc.home.getHomePageData();

// Client-side (with TanStack Query)
import { orpc } from "@/integrations/rpc/client";
const { data } = useQuery(orpc.home.getHomePageData.queryOptions());
```

### Email (Plunk)

```typescript
import { getEmailClient } from "@/integrations/email";

const email = getEmailClient();
await email.emails.send({
    to: "user@example.com",
    subject: "Welcome",
    body: "Hello world!",
});
```

### Internationalization

```typescript
import { getUserLocale, setUserLocale } from "@/integrations/i18n/server";

const locale = await getUserLocale(); // "en" | "ar"
await setUserLocale("ar");
```

## RPC Architecture

### Base Procedures and Middlewares

The `base.ts` file defines:

1. **Error definitions**: Standard error types (INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, INPUT_VALIDATION_FAILED, OUTPUT_VALIDATION_FAILED)

2. **Middlewares**:
   - `injectHeadersMiddleware`: Adds request headers to context
   - `injectCFContextMiddleware`: Adds Cloudflare context
   - `initStorageMiddleware`: Initializes KV and DB clients
   - `initAuthenticationMiddleware`: Initializes auth client
   - `ensureAdminMiddleware`: Validates admin session

3. **Usage in procedures**:

```typescript
import { base } from "@/integrations/rpc";
import { initStorageMiddleware } from "@/integrations/rpc/base";

const domain = base.use(initStorageMiddleware);

export const myProcedure = domain
    .input(MyInputSchema)
    .output(MyOutputSchema)
    .handler(async ({ input, context }) => {
        // context.db, context.kv are available
        return result;
    });
```

### Router Composition

All feature routers are composed in `router.ts`:

```typescript
import { dashboardAuthRoutes } from "@/features/dashboard-auth/server";
import { storageRoutes } from "@/features/storage/server";
import { visitorHomeRoutes } from "@/features/visitor-home/server";

export const appRouter = {
    home: visitorHomeRoutes,
    storage: storageRoutes,
    dashboardAuth: dashboardAuthRoutes,
};
```

## Adding New Integrations

### Structure Pattern

```
integrations/<name>/
├── index.ts           # Re-exports (public API)
├── constants.ts       # Integration-specific constants
├── types.ts           # TypeScript interfaces
├── client/            # Client-side code ("use client")
│   └── index.ts
└── server/            # Server-side code ("server-only")
    └── index.ts
```

### Guidelines

1. **Separate client/server code**: Use `"use client"` and `"server-only"` directives
2. **Use singletons**: Initialize clients once per request
3. **Export from index.ts**: Keep the public API clean
4. **Add constants**: For paths, keys, and configuration
5. **Type everything**: Export interfaces for consumers

### Example: New Service Integration

```typescript
// integrations/sms/server/index.ts
import "server-only";

let smsClient: SMSClient | null = null;

export function getSMSClient(): SMSClient {
    if (!smsClient) {
        smsClient = new SMSClient({
            apiKey: process.env.SMS_API_KEY,
        });
    }
    return smsClient;
}

// integrations/sms/index.ts
export { getSMSClient } from "./server";
export type { SMSOptions, SMSResult } from "./types";
```

## Storage Decision Guide

| Storage | Use For                                            |
| ------- | -------------------------------------------------- |
| **D1**  | Relational data, user accounts, structured content |
| **KV**  | Cache, rate limits, temporary tokens               |
| **R2**  | File uploads, media assets, JSON/text documents    |

## Common Pitfalls

1. **Don't access `process.env.CLOUDFLARE_*` directly** - use `getCFContext().env`
2. **Don't create multiple DB instances** - always use `getDB(env)`
3. **Use correct RPC imports** - `server` for server components, `client` for client components
4. **Migrations require env vars** - ensure `.env.local` exists with Cloudflare credentials
5. **Schema changes require migration** - run `bun run db:generate` after modifying schema
