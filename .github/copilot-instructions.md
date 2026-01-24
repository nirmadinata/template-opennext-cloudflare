# Copilot Instructions for Next.js + Cloudflare Template

## Architecture Overview

This is a Next.js 15 application designed to run on **Cloudflare Workers** using `@opennextjs/cloudflare`. The stack integrates:

- **Cloudflare D1** (SQLite) for database via Drizzle ORM
- **Cloudflare KV** for secondary storage (auth sessions)
- **Cloudflare R2** for file storage
- **better-auth** for authentication with admin plugin
- **next-intl** for internationalization (English/Arabic)
- **TanStack Query** and **React Hook Form** for data fetching and forms
- **ORPC** for type-safe RPC APIs

## Critical Patterns

### Cloudflare Context Access

Always access Cloudflare bindings through the context wrapper:

```typescript
import {
    getCFContext,
    getCFContextSync,
} from "@/integrations/cloudflare-context/server";

// In async contexts (server actions, route handlers)
const { env } = await getCFContext();

// In sync contexts (middleware)
const { env } = getCFContextSync();
```

### Database Access Pattern

Database instances are **singletons** initialized per request:

```typescript
import { getDB } from "@/integrations/db/server";

const db = getDB(env); // env from getCFContext()
```

- Schema uses `snake_case` casing automatically via Drizzle config
- All tables include `created_at` and `updated_at` timestamps with auto-update
- Author tracking uses `created_by`/`updated_by` referencing users table

### API Pattern (ORPC)

All APIs use a unified RPC pattern via `@/integrations/rpc`:

```typescript
// Server-side (in server components, actions)
import { serverRpc } from "@/integrations/rpc/server";
const data = await serverRpc.home.getHomePageData();

// Client-side (with TanStack Query)
import { orpc } from "@/integrations/rpc/client";
const { data } = useQuery(orpc.home.getHomePageData.queryOptions());
```

**Creating new RPC procedures:**

1. Define Zod schemas in `features/<feature>/server/schemas.ts`
2. Create procedures using `publicProcedure`, `authProcedure`, or `adminProcedure` from `@/integrations/rpc`
3. Export router from `features/<feature>/server/index.ts`
4. Register in `integrations/rpc/router.ts`

### Authentication Integration

Auth routes are handled via `app/api/auth/[...all]/route.ts`:

- **better-auth** configured in `integrations/auth/server/index.ts`
- Uses D1 for user/session storage, KV for secondary storage (rate limiting, verification)
- Admin plugin enabled with role-based access (see `ROLE_ENUM` in `integrations/auth/constants.ts`)
- OAuth: Google configured (enable others in `socialProviders`)

### Internationalization Pattern

Locale is cookie-based, not URL-based:

```typescript
import { getUserLocale, setUserLocale } from "@/integrations/i18n/server";

const locale = await getUserLocale(); // Returns "en" | "ar"
```

- Default: English (`LOCALES.EN`)
- Translations in `public/locales/`
- Configured via `integrations/i18n/lib/request.ts`

### Client-Side State Management

Global providers in `components/molecules/client-provider.tsx`:

- TanStack Query with unified devtools panel
- Form devtools integrated alongside query devtools
- All client components must be children of this provider

## Development Workflow

### Environment Setup

Two environments: `local` and `production`

- Recommended runtime: Bun v1.3+ (required). Node.js 20+ may still be useful for some tooling, but Bun is the primary runtime for development and scripts.
- Set `NEXTJS_ENV=local` or `NEXTJS_ENV=production`
- Each has distinct bindings in `wrangler.jsonc`
- Local uses remote=false for KV/D1, remote=true for R2

### Key Commands

Use Bun to run the project's scripts defined in `package.json`.

```bash
# Development
bun run dev                           # Next.js dev with Turbopack
bun run build                         # Build with Next.js

# Linting & Formatting
bun run lint                          # ESLint with auto-fix
bun run format                        # Prettier formatting

# Database migrations
bun run db:generate                   # Generate migrations from schema
bun run db:migrate:local              # Apply to local D1
bun run db:migrate:production         # Apply to production D1
bun run db:studio:local               # Drizzle Studio UI (local)
bun run db:studio:production          # Drizzle Studio UI (production)

# Cloudflare deployment
bun run cf:typegen                    # Generate CloudflareEnv types
bun run cf:build:local                # Build for local/preview
bun run cf:build:production           # Build for production
bun run cf:deploy:local               # Deploy to local/preview
bun run cf:deploy:production          # Deploy to production

# Email templates (React Email)
bun run email:dev                     # Preview emails
bun run email:build                   # Build email templates
```

### Database Schema Changes

1. Edit `integrations/db/schema.ts`
2. Run `bun run db:generate` to create migration
3. Apply with `bun run db:migrate:local` or `db:migrate:production`
4. Never edit generated SQL directly

### Adding UI Components

UI components in `components/ui/` use:

- **Radix UI** primitives
- **class-variance-authority** for variants
- **Tailwind CSS v4** (PostCSS-based)
- Import via `@/components/ui/<component>`

## Project-Specific Conventions

### Import Paths

- Use `@/*` for all internal imports (configured in `tsconfig.json`)
- Server-only code must import `"server-only"` at top

### Folder Organization

- `hooks/` - Global reusable React hooks (useUpload, useUploadWithProgress, useIsMobile)
- `integrations/` - External service wrappers (auth, db, kv, i18n, rpc, cloudflare-context)
- `features/` - Feature-specific code with atomic design structure
- `components/ui/` - Reusable UI primitives
- `components/molecules/` - Composite client components
- `components/templates/` - Email templates
- `app/(admin)/` - Route group for admin pages (shares layout)

### Global Hooks Pattern

Reusable hooks that work across features belong in `hooks/`:

```typescript
// hooks/use-upload.ts - Reusable file upload hook
import { useUpload, useUploadWithProgress } from "@/hooks";

// Use in any feature
const { upload, isUploading, error } = useUpload({
    path: "uploads/documents",
    onSuccess: (key) => console.log(`Uploaded: ${key}`),
});

// With progress tracking
const { upload, progress, cancel } = useUploadWithProgress({
    path: "uploads/images",
    filename: "custom-name.jpg", // Optional custom filename
    onProgress: (p) => console.log(`${p.percentage}%`),
});
```

### Feature Structure (Atomic Design)

Each feature in `features/` follows this structure:

```
features/<feature>/
├── utils/           # Feature-specific utilities
├── hooks/           # Feature-specific hooks (feature-only logic)
├── components/
│   ├── atoms/       # Basic elements (Heading, Text, Icon)
│   ├── molecules/   # Simple groups (Cards, Items)
│   ├── organisms/   # Complex sections
│   └── templates/   # Full page layouts
├── server/
│   ├── schemas.ts   # Zod schemas
│   ├── procedures.ts # ORPC procedures
│   └── router.ts    # Feature router
└── AGENTS.md        # Feature-specific AI instructions
```

**Feature-Specific Hooks (vs Global):**

Feature hooks should only contain logic that is:

- Unique to the feature's business domain
- Not reusable across other features
- Tightly coupled to feature-specific data or components

```typescript
// features/checkout/hooks/use-cart-total.ts - Feature-specific
export function useCartTotal() {
    // Logic specific to checkout feature
}
```

### API Routes

- RPC at `app/api/rpc/[[...path]]/route.ts` using `createRpcHandler` from `@/integrations/rpc`
- Auth routes use `toNextJsHandler` from better-auth
- Always pass CloudflareEnv to integration functions

### Type Safety

- CloudflareEnv types auto-generated via `bun run cf:typegen`
- Drizzle schema exports types directly: `import { users } from "@/integrations/db/schema"`
- Use Zod schemas from `drizzle-zod` for validation

## Integration Boundaries

### When to Use Each Storage

- **D1**: Relational data, user accounts, sessions, structured content
- **KV**: Cache, rate limits, temporary verification tokens (via better-auth secondary storage)
- **R2**: File uploads, media assets, JSON/text data storage

### R2 Storage Pattern

Two clients available for R2:

1. **R2 Binding** (`getR2Storage`) - Direct binding for server-side text/JSON operations
2. **S3 Client** (`getS3PresignedUrlGenerator`) - For presigned URL generation (client uploads)

```typescript
// Server-side text storage (uses R2 binding)
import { getCFContext } from "@/integrations/cloudflare-context/server";
import { getR2Storage } from "@/integrations/r2/server";

const { env } = await getCFContext();
const storage = getR2Storage(env);

await storage.setJson("config/settings.json", { theme: "dark" });
const settings = await storage.getJson("config/settings.json");

// Presigned URLs for client uploads (uses S3-compatible API)
import { getS3PresignedUrlGenerator } from "@/integrations/r2/server";

const generator = getS3PresignedUrlGenerator();
const { url } = await generator.generateUploadUrl({
    key: "uploads/avatar.jpg",
    contentType: "image/jpeg",
});
```

Use constants from `@/integrations/r2` for consistent path naming:

```typescript
import { R2_PATHS, buildR2Key } from "@/integrations/r2";

const key = buildR2Key(R2_PATHS.USER_UPLOADS, userId, "avatar.jpg");
// Result: "uploads/users/{userId}/avatar.jpg"
```

### External Dependencies

- **ORPC**: Type-safe RPC APIs in `integrations/rpc/`, feature routers in `features/*/server/`
- **better-auth**: All auth logic centralized in `integrations/auth/`
- **Drizzle**: Database schema is source of truth, migrations auto-generated
- **next-intl**: Wrapped in `integrations/i18n/` for custom locale logic
- **aws4fetch**: Used for R2 S3-compatible API (presigned URLs)

## Common Pitfalls

1. **Don't access `process.env.CLOUDFLARE_*` directly** - use `getCFContext().env`
2. **Don't create multiple DB instances** - always use `getDB(env)`
3. **Migrations require environment variables** - ensure `.env.local` / `.env.production` exist with Cloudflare credentials
4. **Admin routes require authentication** - check session in layout or middleware
5. **Locale changes need server action** - client can't set cookies directly
6. **Use correct RPC imports** - `@/integrations/rpc/server` for server components, `@/integrations/rpc/client` for client components
