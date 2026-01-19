# Visitor Home Feature

## Purpose

Public-facing home page for visitors. Displays hero, features, testimonials, stats sections, and R2 storage demo.

## Structure

```
visitor-home/
├── utils/               # Feature-specific utilities
├── hooks/               # Feature-specific React hooks (feature-only logic)
├── components/          # Atomic design components
│   ├── atoms/           # Basic elements (Heading, Text, Icon)
│   ├── molecules/       # Groups (FeatureCard, TestimonialCarousel, FileUploadCard, etc.)
│   ├── organisms/       # Sections (HeroSection, StorageDemoSection, TestimonialsCarouselSection)
│   └── templates/       # Full layouts (HomePageTemplate, ClientHomeContent)
├── server/              # API layer
│   ├── schemas.ts       # Zod schemas for type safety
│   ├── mock-data.ts     # Mock data (replace with DB queries)
│   ├── procedures.ts    # ORPC procedures (API endpoints)
│   └── index.ts         # Server exports (exports visitorHomeRoutes)
└── index.ts             # Public exports
```

## Key Components

### StorageDemoSection

Demonstrates the integration with the `storage` feature. It allows visitors to:
- Upload files using client-side presigned URLs (via `FileUploadCard` molecule)
- Store text/JSON data using server-side R2 bindings (via `TextStorageCard` molecule)

### TestimonialsCarouselSection

A dynamic carousel of testimonials, built using the `TestimonialCarousel` molecule which manages the swiping/navigating logic.

## Key Patterns

### Using Global Hooks

Reusable hooks like `useUpload` and `useUploadWithProgress` are in the global `hooks/` folder:

```tsx
import { useUploadWithProgress } from "@/hooks";

function MyComponent() {
    const { upload, cancel, reset, isUploading, progress, uploadedKey, error } =
        useUploadWithProgress({
            path: "uploads/avatars",
            onProgress: (p) => console.log(`${p.percentage}%`),
            onSuccess: (key) => console.log(`Uploaded: ${key}`),
        });

    return (
        <div>
            <button onClick={() => upload(file)} disabled={isUploading}>
                {isUploading ? `${progress.percentage}%` : "Upload"}
            </button>
            {isUploading && <button onClick={cancel}>Cancel</button>}
        </div>
    );
}
```

### Feature-Specific Hooks

Feature-specific hooks (in `features/<feature>/hooks/`) should only contain logic that is:

- Unique to the feature's business domain
- Not reusable across other features
- Tightly coupled to feature-specific data or components

### Type Naming Convention

All types exported from schemas use the `Type` suffix:

- `HeroSectionType`, `FeatureItemType`, `StatItemType`, etc.
- This avoids naming conflicts with components

### Adding a New Section

1. Create schema in `server/schemas.ts` with `Type` suffix for exports
2. Add mock data in `server/mock-data.ts`
3. Create procedure in `server/procedures.ts` using `publicProcedure` from `@/integrations/rpc`
4. Export from `server/router.ts`
5. Register router in `integrations/rpc/router.ts`
6. Create components following atomic design

### Component Hierarchy

- **Atoms**: Pure presentational, no business logic
- **Molecules**: Combine atoms, receive single data object (some are client components)
- **Organisms**: Feature-specific sections, may be client components for interactivity
- **Templates**: Compose organisms into page layouts

### Interactive Components

Some molecules/organisms are client components (`"use client"`):

- `StatCard` - Animated counting on viewport entry
- `TestimonialCarousel` - Auto-play carousel with keyboard navigation
- `TestimonialsCarouselSection` - Carousel-based testimonials section
- `ClientHomeContent` - Full client-side page with React Query
- `FileUploadCard` - Client-side file upload to R2 via presigned URLs
- `TextStorageCard` - Demo for server-side text storage

### R2 Storage Demo Components

The `StorageDemoSection` organism demonstrates R2 storage integration:

1. **FileUploadCard** (client component):
    - Uses `useUploadWithProgress` hook from `../../hooks`
    - Provides progress tracking and cancel functionality
    - Validates file type and size using utilities from `@/integrations/r2/client`

2. **TextStorageCard** (client component):
    - Demonstrates server-side JSON/text storage pattern
    - Uses `R2_PATHS` constants for consistent key naming

### API Pattern

All procedures use ORPC with:

- `.output()` for response schema validation
- `.handler()` for business logic

## Data Flow

### Server-Side Rendering (SSR)

```tsx
// app/page.tsx
import { serverRpc } from "@/integrations/rpc/server";

const data = await serverRpc.home.getHomePageData();
return <HomePageTemplate data={data} />;
```

### Client-Side Rendering (CSR)

```tsx
// features/visitor-home/components/templates/client-home-content.tsx
import { orpc } from "@/integrations/rpc/client";

const { data, isLoading } = useQuery(orpc.home.getHomePageData.queryOptions());
```

Compare both approaches at:

- SSR: `/` (main page)
- CSR: `/client-example` (demonstrates React Query)

## Extending

To add real database integration:

1. Import `getCFContext` from `@/integrations/cloudflare-context/server` and `getDB` from `@/integrations/db/server`
2. Replace mock data with D1 queries in procedure handlers
3. Add database schema in `integrations/db/schema.ts`
