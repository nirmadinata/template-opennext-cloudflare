# Copilot Instructions for Next.js + Cloudflare Template

## Architecture Overview

This is a Next.js 15 application designed to run on **Cloudflare Workers** using `@opennextjs/cloudflare`. The stack integrates:

- **Cloudflare D1** (SQLite) for database via Drizzle ORM
- **Cloudflare KV** for secondary storage (auth sessions)
- **Cloudflare R2** for file storage
- **better-auth** for authentication with admin plugin
- **next-intl** for internationalization (English/Arabic)
- **TanStack Query** and **TanStack Form** for data fetching and forms
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
import { getInternalDB } from "@/integrations/internal-db/server";

const db = getInternalDB(env); // env from getCFContext()
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
3. Export router from `features/<feature>/server/router.ts`
4. Register in `integrations/rpc/router.ts`

### Authentication Integration

Auth routes are handled via [app/api/auth/[...all]/route.ts](app/api/auth/[...all]/route.ts):

- **better-auth** configured in [integrations/internal-auth/server/index.ts](integrations/internal-auth/server/index.ts)
- Uses D1 for user/session storage, KV for secondary storage (rate limiting, verification)
- Admin plugin enabled with role-based access (see `USER_ROLE_LIST` in schema)
- OAuth: Google configured (enable others in `socialProviders`)

### Internationalization Pattern

Locale is cookie-based, not URL-based:

```typescript
import { getUserLocale, setUserLocale } from "@/integrations/i18n/server";

const locale = await getUserLocale(); // Returns "en" | "ar"
```

- Default: English (`LOCALES.EN`)
- Translations in [public/locales/](public/locales/)
- Configured via [integrations/i18n/lib/request.ts](integrations/i18n/lib/request.ts)

### Client-Side State Management

Global providers in [components/molecules/client-provider.tsx](components/molecules/client-provider.tsx):

- TanStack Query with unified devtools panel
- Form devtools integrated alongside query devtools
- All client components must be children of this provider

## Development Workflow

### Environment Setup

Two environments: `local` and `production`

- Set `NEXTJS_ENV=local` or `NEXTJS_ENV=production`
- Each has distinct bindings in [wrangler.jsonc](wrangler.jsonc)
- Local uses remote=false for KV/D1, remote=true for R2

### Key Commands

```bash
# Development
bun run dev                           # Next.js dev with Turbopack

# Database migrations
bun run internal:generate             # Generate migrations from schema
bun run internal:migrate:local        # Apply to local D1
bun run internal:migrate:production   # Apply to production D1
bun run internal:studio:local         # Drizzle Studio UI

# Cloudflare deployment
bun run cf:typegen                    # Generate CloudflareEnv types
bun run cf:build:local                # Build for local/preview
bun run cf:deploy:production          # Deploy to production

# Email templates (React Email)
bun run email:dev                     # Preview emails
```

### Database Schema Changes

1. Edit [integrations/internal-db/schema.ts](integrations/internal-db/schema.ts)
2. Run `bun run internal:generate` to create migration
3. Apply with `bun run internal:migrate:local` or `:production`
4. Never edit generated SQL directly

### Adding UI Components

UI components in [components/ui/](components/ui/) use:

- **Radix UI** primitives
- **class-variance-authority** for variants
- **Tailwind CSS v4** (PostCSS-based)
- Import via `@/components/ui/<component>`

## Project-Specific Conventions

### Import Paths

- Use `@/*` for all internal imports (configured in [tsconfig.json](tsconfig.json))
- Server-only code must import `"server-only"` at top

### Folder Organization

- `integrations/` - External service wrappers (auth, db, kv, i18n, rest)
- `features/` - Feature-specific code with atomic design structure
- `components/ui/` - Reusable UI primitives
- `components/molecules/` - Composite client components
- `components/templates/` - Email templates
- `app/(admin)/` - Route group for admin pages (shares layout)

### Feature Structure (Atomic Design)

Each feature in `features/` follows this structure:

```
features/<feature>/
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

### API Routes

- RPC at `app/api/rpc/[[...path]]/route.ts` using `createRpcHandler` from `@/integrations/rpc`
- Auth routes use `toNextJsHandler` from better-auth
- Always pass CloudflareEnv to integration functions

### Type Safety

- CloudflareEnv types auto-generated via `bun run cf:typegen`
- Drizzle schema exports types directly: `import { users } from "@/integrations/internal-db/schema"`
- Use Zod schemas from `drizzle-zod` for validation

## Integration Boundaries

### When to Use Each Storage

- **D1**: Relational data, user accounts, sessions, structured content
- **KV**: Cache, rate limits, temporary verification tokens (via better-auth secondary storage)
- **R2**: File uploads, media assets

### External Dependencies

- **ORPC**: Type-safe RPC APIs in `integrations/rpc/`, feature routers in `features/*/server/`
- **better-auth**: All auth logic centralized in `integrations/internal-auth/`
- **Drizzle**: Database schema is source of truth, migrations auto-generated
- **next-intl**: Wrapped in `integrations/i18n/` for custom locale logic

## Common Pitfalls

1. **Don't access `process.env.CLOUDFLARE_*` directly** - use `getCFContext().env`
2. **Don't create multiple DB instances** - always use `getInternalDB(env)`
3. **Migrations require environment variables** - ensure `.env.local` / `.env.production` exist with Cloudflare credentials
4. **Admin routes require authentication** - check session in layout or middleware
5. **Locale changes need server action** - client can't set cookies directly
6. **Use correct RPC imports** - `@/integrations/rpc/server` for server components, `@/integrations/rpc/client` for client components
