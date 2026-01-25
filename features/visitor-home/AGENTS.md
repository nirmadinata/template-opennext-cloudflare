# Visitor Home Feature

## Purpose

Public-facing home page for visitors. Displays hero, features, testimonials, stats sections, and R2 storage demo.

## Structure

```
visitor-home/
├── AGENTS.md            # This documentation
├── index.ts             # Public exports (components, server)
├── components/          # Atomic design components
│   ├── index.ts         # All component exports
│   ├── atoms/           # Basic elements
│   │   ├── heading.tsx
│   │   ├── text.tsx
│   │   └── icon.tsx
│   ├── molecules/       # Simple component groups
│   │   ├── feature-card.tsx
│   │   ├── testimonial-card.tsx
│   │   ├── testimonial-carousel.tsx  # Client component
│   │   ├── stat-card.tsx             # Client component (animated)
│   │   ├── file-upload-card.tsx      # Client component (R2 upload)
│   │   └── text-storage-card.tsx     # Client component (R2 text storage)
│   ├── organisms/       # Feature sections
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── testimonials-section.tsx
│   │   ├── testimonials-carousel-section.tsx  # Client component
│   │   ├── stats-section.tsx
│   │   └── storage-demo-section.tsx
│   └── templates/       # Full page layouts
│       ├── home-page-template.tsx     # SSR template
│       └── client-home-content.tsx    # CSR template
└── server/              # API layer
    ├── index.ts         # Server exports (visitorHomeRoutes)
    ├── schemas.ts       # Zod schemas with Type exports
    ├── mock-data.ts     # Mock data (replace with DB queries)
    └── procedures.ts    # ORPC procedures
```

## Key Components

### Templates

#### `HomePageTemplate` (SSR)

Server-rendered home page template used by `app/page.tsx`:

```tsx
// app/page.tsx
import { HomePageTemplate } from "@/features/visitor-home/components";
import { serverRpc } from "@/integrations/rpc/server";

export default async function Page() {
    const data = await serverRpc.home.getHomePageData();
    return <HomePageTemplate data={data} />;
}
```

#### `ClientHomeContent` (CSR)

Client-rendered alternative demonstrating TanStack Query:

```tsx
// app/client-example/page.tsx
import { ClientHomeContent } from "@/features/visitor-home/components";

export default function Page() {
    return <ClientHomeContent />;
}
```

### Storage Demo Components

#### `StorageDemoSection`

Demonstrates R2 storage integration with two cards:

1. **FileUploadCard** (client component):
   - Uses `useUploadWithProgress` hook from `@/hooks`
   - Provides progress tracking and cancel functionality
   - Validates file type and size

2. **TextStorageCard** (client component):
   - Demonstrates server-side JSON/text storage pattern
   - Uses RPC to store/retrieve data

### Interactive Components

Client components (marked with `"use client"`):

| Component                     | Purpose                                |
| ----------------------------- | -------------------------------------- |
| `StatCard`                    | Animated counting on viewport entry    |
| `TestimonialCarousel`         | Auto-play carousel with keyboard nav   |
| `TestimonialsCarouselSection` | Carousel-based testimonials section    |
| `FileUploadCard`              | File upload to R2 via presigned URLs   |
| `TextStorageCard`             | Demo for server-side text storage      |
| `ClientHomeContent`           | Full client-side page with React Query |

## Schema Organization

All schemas in `server/schemas.ts` with `Type` suffix exports:

```typescript
import {
    HeroSectionSchema,
    HeroSectionType,
    FeatureItemSchema,
    FeatureItemType,
    HomePageDataSchema,
    HomePageDataType,
} from "@/features/visitor-home/server/schemas";
```

### Available Schemas

| Schema                      | Description                 |
| --------------------------- | --------------------------- |
| `HeroSectionSchema`         | Hero section data           |
| `FeatureItemSchema`         | Single feature item         |
| `FeaturesSectionSchema`     | Features section with items |
| `TestimonialItemSchema`     | Single testimonial          |
| `TestimonialsSectionSchema` | Testimonials section        |
| `StatItemSchema`            | Single stat item            |
| `StatsSectionSchema`        | Stats section with items    |
| `HomePageDataSchema`        | Complete home page data     |

## Available RPC Procedures

| Procedure                | Description                      |
| ------------------------ | -------------------------------- |
| `getHeroSection`         | Returns hero section data        |
| `getFeaturesSection`     | Returns features section data    |
| `getTestimonialsSection` | Returns testimonials section     |
| `getStatsSection`        | Returns stats section data       |
| `getHomePageData`        | Returns all sections in one call |

### Usage

```typescript
// Server-side (SSR)
import { serverRpc } from "@/integrations/rpc/server";
const data = await serverRpc.home.getHomePageData();

// Client-side (CSR)
import { orpc } from "@/integrations/rpc/client";
const { data } = useQuery(orpc.home.getHomePageData.queryOptions());
```

## Component Hierarchy

- **Atoms**: Pure presentational, no business logic (`Heading`, `Text`, `Icon`)
- **Molecules**: Combine atoms, receive single data object (some are client components)
- **Organisms**: Feature-specific sections, may be client components for interactivity
- **Templates**: Compose organisms into page layouts

## Using Global Hooks

Reusable hooks like `useUpload` and `useUploadWithProgress` are in the global `hooks/` folder:

```tsx
import { useUploadWithProgress } from "@/hooks";

function FileUploadCard() {
    const { upload, cancel, reset, isUploading, progress, uploadedKey, error } =
        useUploadWithProgress({
            path: "uploads/demo",
            onSuccess: () => console.log("Upload complete"),
        });
    // ...
}
```

## Adding a New Section

1. **Add schema** in `server/schemas.ts` with `Type` suffix
2. **Add mock data** in `server/mock-data.ts`
3. **Create procedure** in `server/procedures.ts`
4. **Create components** following atomic design:
   - Atoms for basic elements
   - Molecule for section card/item
   - Organism for complete section
5. **Export** from respective index files
6. **Add to template** in `templates/home-page-template.tsx`

## Data Flow Patterns

### Server-Side Rendering (SSR)

```
app/page.tsx → serverRpc.home.getHomePageData() → HomePageTemplate → Organisms
```

### Client-Side Rendering (CSR)

```
app/client-example/page.tsx → ClientHomeContent → useQuery(orpc.home...) → Organisms
```

Compare both approaches:
- SSR: `/` (main page)
- CSR: `/client-example`
