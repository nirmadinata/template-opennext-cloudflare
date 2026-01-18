# Next.js + Cloudflare Template

A production-ready Next.js 15 template designed to run on **Cloudflare Workers** using `@opennextjs/cloudflare`.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Runtime**: [Cloudflare Workers](https://workers.cloudflare.com/) via [@opennextjs/cloudflare](https://github.com/opennextjs/opennextjs-cloudflare)
- **Database**: [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) with [Drizzle ORM](https://orm.drizzle.team/)
- **Storage**: [Cloudflare KV](https://developers.cloudflare.com/kv/) (sessions) + [R2](https://developers.cloudflare.com/r2/) (files)
- **Authentication**: [better-auth](https://www.better-auth.com/) with admin plugin
- **API**: [ORPC](https://orpc.unnoq.com/) for type-safe RPC
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) + [TanStack Form](https://tanstack.com/form)
- **Internationalization**: [next-intl](https://next-intl-docs.vercel.app/) (English/Arabic)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) v1.3+ (recommended) or Node.js 20+
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) for Cloudflare deployment
- Cloudflare account with D1, KV, and R2 enabled

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd template-opennext-cloudflare

# Install dependencies
bun install

# Copy environment files
cp .env.example .env.local
cp .env.example .env.production
```

### Development

```bash
# Start development server with Turbopack
bun run dev

# Generate TypeScript types for Cloudflare bindings
bun run cf:typegen
```

### Database Setup

```bash
# Generate migrations from schema
bun run db:generate

# Apply migrations to local D1
bun run db:migrate:local

# Apply migrations to production D1
bun run db:migrate:production

# Open Drizzle Studio (local)
bun run db:studio:local
```

### Deployment

```bash
# Build for local/preview environment
bun run cf:build:local

# Deploy to local/preview
bun run cf:deploy:local

# Build for production
bun run cf:build:production

# Deploy to production
bun run cf:deploy:production
```

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin route group
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── rpc/             # ORPC endpoints
│   └── client-example/      # CSR example page
├── components/
│   ├── molecules/           # Composite client components
│   ├── templates/           # Email templates
│   └── ui/                  # Radix UI primitives
├── configs/                 # App configuration
├── features/                # Feature modules (atomic design)
│   ├── storage/            # R2 storage RPC procedures
│   └── visitor-home/       # Home page feature
├── hooks/                   # React hooks
├── integrations/            # External service wrappers
│   ├── auth/               # better-auth integration
│   ├── cloudflare-context/ # Cloudflare bindings
│   ├── db/                 # Drizzle ORM + D1
│   ├── i18n/               # next-intl configuration
│   ├── kv/                 # Cloudflare KV
│   ├── r2/                 # Cloudflare R2 storage
│   └── rpc/                # ORPC setup
├── lib/                     # Utility functions
└── public/                  # Static assets
    └── locales/            # Translation files
```

## Scripts Reference

| Script                          | Description                             |
| ------------------------------- | --------------------------------------- |
| `bun run dev`                   | Start development server with Turbopack |
| `bun run build`                 | Build Next.js application               |
| `bun run build-analyze`         | Build with bundle analyzer              |
| `bun run lint`                  | Run ESLint with auto-fix                |
| `bun run format`                | Format code with Prettier               |
| `bun run cf:typegen`            | Generate CloudflareEnv TypeScript types |
| `bun run cf:build:local`        | Build for local/preview environment     |
| `bun run cf:build:production`   | Build for production                    |
| `bun run cf:deploy:local`       | Deploy to local/preview                 |
| `bun run cf:deploy:production`  | Deploy to production                    |
| `bun run db:generate`           | Generate Drizzle migrations             |
| `bun run db:migrate:local`      | Apply migrations to local D1            |
| `bun run db:migrate:production` | Apply migrations to production D1       |
| `bun run db:studio:local`       | Open Drizzle Studio (local)             |
| `bun run db:studio:production`  | Open Drizzle Studio (production)        |
| `bun run email:dev`             | Preview email templates                 |
| `bun run email:build`           | Build email templates                   |

## Environment Variables

Create `.env.local` and `.env.production` files with the following variables:

```bash
# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Cloudflare credentials
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_DATABASE_ID=your_d1_database_id
CLOUDFLARE_API_TOKEN=your_api_token

# R2 Storage (S3-compatible API for presigned URLs)
# Generate these in Cloudflare Dashboard > R2 > Manage R2 API Tokens
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name

# Authentication
BETTER_AUTH_SECRET=your_secret_key

# OAuth (Google)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Key Patterns

### Cloudflare Context Access

```typescript
import { getCFContext } from "@/integrations/cloudflare-context/server";

// In async contexts
const { env } = await getCFContext();
```

### Database Access

```typescript
import { getDB } from "@/integrations/db/server";

const db = getDB(env);
const users = await db.query.users.findMany();
```

### RPC API (Server-side)

```typescript
import { serverRpc } from "@/integrations/rpc/server";

const data = await serverRpc.home.getHomePageData();
```

### RPC API (Client-side with TanStack Query)

```typescript
import { orpc } from "@/integrations/rpc/client";
import { useQuery } from "@tanstack/react-query";

const { data } = useQuery(orpc.home.getHomePageData.queryOptions());
```

### R2 Storage

#### Server-side text/JSON storage (via R2 binding):

```typescript
import { getCFContext } from "@/integrations/cloudflare-context/server";
import { getR2Storage } from "@/integrations/r2/server";

const { env } = await getCFContext();
const storage = getR2Storage(env);

// Store JSON
await storage.setJson("config/settings.json", { theme: "dark" });

// Retrieve JSON
const settings = await storage.getJson<{ theme: string }>(
    "config/settings.json"
);

// Store text
await storage.setText("data/notes.txt", "Hello, World!");

// Retrieve text
const notes = await storage.getText("data/notes.txt");
```

#### Generate presigned URLs for client uploads (via RPC):

```typescript
// Server-side (in a procedure or server component)
import { getS3PresignedUrlGenerator } from "@/integrations/r2/server";

const generator = getS3PresignedUrlGenerator();
const { url, key, expiresAt } = await generator.generateUploadUrl({
    key: "uploads/users/123/avatar.jpg",
    contentType: "image/jpeg",
    expiresIn: 3600, // 1 hour
});
```

#### Client-side file upload:

```typescript
import { uploadToPresignedUrl } from "@/integrations/r2/client";

// Get presigned URL from server (via RPC)
const { url, key } = await orpc.storage.generateUploadUrl.call({
    key: "uploads/avatar.jpg",
    contentType: file.type,
});

// Upload file with progress tracking
const result = await uploadToPresignedUrl({
    url,
    file: selectedFile,
    contentType: file.type,
    onProgress: ({ percentage }) => {
        console.log(`Upload progress: ${percentage}%`);
    },
});
```

## Feature Module Structure

Each feature follows atomic design principles:

```
features/<feature>/
├── components/
│   ├── atoms/       # Basic elements
│   ├── molecules/   # Simple groups
│   ├── organisms/   # Complex sections
│   └── templates/   # Page layouts
├── server/
│   ├── schemas.ts   # Zod schemas
│   ├── procedures.ts # ORPC procedures
│   └── router.ts    # Feature router
└── AGENTS.md        # AI coding instructions
```

## License

MIT
