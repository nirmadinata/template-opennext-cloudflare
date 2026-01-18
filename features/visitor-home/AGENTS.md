# Visitor Home Feature

## Purpose
Public-facing home page for visitors. Displays hero, features, testimonials, and stats sections.

## Structure
```
visitor-home/
├── components/           # Atomic design components
│   ├── atoms/           # Basic elements (Heading, Text, Icon)
│   ├── molecules/       # Simple groups (FeatureCard, StatCard, TestimonialCard, TestimonialCarousel)
│   ├── organisms/       # Page sections (HeroSection, FeaturesSection, etc.)
│   └── templates/       # Full layouts (HomePageTemplate, ClientHomeContent)
├── server/              # API layer
│   ├── schemas.ts       # Zod schemas for type safety
│   ├── mock-data.ts     # Mock data (replace with DB queries)
│   ├── procedures.ts    # ORPC procedures (API endpoints)
│   └── router.ts        # Feature router (compose procedures)
└── index.ts             # Public exports
```

## Key Patterns

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

const { data, isLoading } = useQuery(
    orpc.home.getHomePageData.queryOptions()
);
```

Compare both approaches at:
- SSR: `/` (main page)
- CSR: `/client-example` (demonstrates React Query)

## Extending
To add real database integration:
1. Import `getCFContext` from `@/integrations/cloudflare-context/server` and `getDB` from `@/integrations/db/server`
2. Replace mock data with D1 queries in procedure handlers
3. Add database schema in `integrations/db/schema.ts`
