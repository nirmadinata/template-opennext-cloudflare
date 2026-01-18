# Integrations

## Purpose

External service wrappers and API clients. Each integration provides a consistent interface to interact with external services like Cloudflare D1, KV, R2, authentication, and RPC.

## Structure

```
integrations/
├── AGENTS.md              # This documentation
├── auth/                  # Authentication (better-auth)
│   ├── client/            # Client-side auth helpers
│   ├── server/            # Server-side auth configuration
│   └── constants.ts       # Role enums, auth constants
├── cloudflare-context/    # Cloudflare bindings access
│   ├── index.ts           # Re-exports
│   └── server/            # getCFContext, getCFContextSync
├── db/                    # Database (Drizzle + D1)
│   ├── server/            # getDB singleton
│   ├── schema.ts          # Drizzle schema definitions
│   ├── migrations/        # Generated SQL migrations
│   └── drizzle.config.ts  # Drizzle configuration
├── i18n/                  # Internationalization (next-intl)
│   ├── server/            # getUserLocale, setUserLocale
│   └── lib/               # Request config, types, utils
├── kv/                    # Cloudflare KV storage
│   └── server/            # getKVStorage
├── r2/                    # Cloudflare R2 storage
│   ├── client/            # Client-side upload utilities
│   ├── server/            # S3 client, R2 binding operations
│   ├── constants.ts       # R2_PATHS, ALLOWED_MIME_TYPES
│   └── types.ts           # R2 interfaces
└── rpc/                   # ORPC (type-safe RPC)
    ├── client/            # Client-side orpc instance
    ├── server/            # Server-side serverRpc instance
    ├── router.ts          # Main router composition
    ├── base.ts            # Base procedures (public, auth, admin)
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
import { auth } from "@/integrations/auth/server";
const session = await auth.api.getSession({ headers });
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

### Internationalization

```typescript
import { getUserLocale, setUserLocale } from "@/integrations/i18n/server";

const locale = await getUserLocale(); // "en" | "ar"
await setUserLocale("ar");
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
// integrations/email/server/index.ts
import "server-only";
import { getCFContext } from "@/integrations/cloudflare-context/server";

let emailClient: EmailClient | null = null;

export function getEmailClient(): EmailClient {
    if (!emailClient) {
        emailClient = new EmailClient({
            apiKey: process.env.EMAIL_API_KEY,
        });
    }
    return emailClient;
}

// integrations/email/index.ts
export { getEmailClient } from "./server";
export type { EmailOptions, EmailResult } from "./types";
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
