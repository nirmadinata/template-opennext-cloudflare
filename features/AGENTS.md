# Features

## Purpose

Feature modules containing domain-specific code. Each feature is self-contained with its own components, hooks, server logic, and documentation.

## Structure

```
features/
├── AGENTS.md                    # This documentation
├── dashboard-auth/              # Authentication flows for dashboard
│   ├── AGENTS.md               # Feature-specific documentation
│   ├── index.ts                # Public exports
│   ├── components/             # Atomic design components
│   ├── hooks/                  # Form logic hooks
│   ├── lib/                    # Feature-specific utilities
│   └── server/                 # RPC procedures and schemas
├── storage/                     # R2 storage operations
│   ├── AGENTS.md
│   ├── index.ts
│   └── server/                 # Presigned URL procedures
└── visitor-home/                # Public home page
    ├── AGENTS.md
    ├── index.ts
    ├── components/             # Full atomic design structure
    └── server/                 # Page data procedures
```

## Feature Structure Pattern

Each feature follows this structure:

```
features/<feature-name>/
├── AGENTS.md                    # Feature documentation (required)
├── index.ts                     # Public exports
├── components/                  # Atomic design components
│   ├── index.ts                # Component exports
│   ├── form-schemas.ts         # Client-side form validation (if forms exist)
│   ├── atoms/                  # Basic building blocks
│   ├── molecules/              # Simple component groups
│   ├── organisms/              # Complex sections
│   └── templates/              # Page layouts (if needed)
├── hooks/                       # Feature-specific React hooks
│   └── index.ts                # Hook exports
├── lib/                         # Feature-specific utilities
│   └── constants.ts            # Feature constants
└── server/                      # Server-side code
    ├── index.ts                # Server exports (routes, schemas)
    ├── schemas.ts              # RPC input/output schemas
    ├── procedures.ts           # ORPC procedures
    └── mock-data.ts            # Mock data (if needed)
```

## Atomic Design Principles

### Component Hierarchy

1. **Atoms**: Smallest building blocks, no business logic
   - Examples: `Heading`, `Text`, `Icon`, `PasswordStrengthMeter`
   - Pure presentational, highly reusable
   
2. **Molecules**: Combinations of atoms with minimal logic
   - Examples: `FeatureCard`, `AuthHeader`, `FileUploadCard`
   - May be client components for interactivity
   
3. **Organisms**: Complex sections with business logic
   - Examples: `LoginForm`, `HeroSection`, `StorageDemoSection`
   - Often use feature hooks for logic separation
   
4. **Templates**: Page layouts composing organisms
   - Examples: `HomePageTemplate`, `ClientHomeContent`
   - Connect to data sources (SSR or CSR)

### When to Create Each Level

| Level    | Create When                            |
| -------- | -------------------------------------- |
| Atom     | Need a basic reusable element          |
| Molecule | Combining atoms for a specific purpose |
| Organism | Building a complete section/form       |
| Template | Need a full page layout                |

## Server Module Pattern

### Schema Separation

Schemas are separated by purpose:

**Form Schemas** (`components/form-schemas.ts`):
Client-side form validation with user-friendly error messages.

```typescript
// components/form-schemas.ts
import { z } from "zod";

export const myFormSchema = z.object({
    email: z.email("Invalid email address"),
    name: z.string().min(2, "Name must be at least 2 characters"),
});

export type MyFormType = z.infer<typeof myFormSchema>;
```

**Server Schemas** (`server/schemas.ts`):
RPC input/output schemas for API validation.

```typescript
// server/schemas.ts
import { z } from "zod";

export const MyInputSchema = z.object({
    id: z.string(),
    name: z.string(),
});

export type MyInputType = z.infer<typeof MyInputSchema>;
```

### Procedure Organization

All procedures in `server/procedures.ts`:

```typescript
// server/procedures.ts
import { base } from "@/integrations/rpc";
import { MyInputSchema, MyOutputSchema } from "./schemas";

const domain = base; // Add middlewares if needed

export const myProcedure = domain
    .input(MyInputSchema)
    .output(MyOutputSchema)
    .handler(async ({ input, context }) => {
        return result;
    });
```

### Server Exports

```typescript
// server/index.ts
export * as myFeatureRoutes from "./procedures";
export * from "./schemas";
```

### Router Registration

Add to `integrations/rpc/router.ts`:

```typescript
import { myFeatureRoutes } from "@/features/my-feature/server";

export const appRouter = {
    // ... existing routes
    myFeature: myFeatureRoutes,
};
```

## Hook Patterns

### Feature vs Global Hooks

| Location            | Use For                                  |
| ------------------- | ---------------------------------------- |
| `hooks/`            | Reusable across all features             |
| `features/*/hooks/` | Specific to one feature's business logic |

### Form Hook Pattern

Extract form logic from components:

```typescript
// features/my-feature/hooks/use-my-form.ts
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { myFormSchema } from "@/features/my-feature/components/form-schemas";

export function useMyForm() {
    const form = useForm({
        resolver: zodResolver(myFormSchema),
        defaultValues: { field: "" },
    });
    
    const onSubmit = form.handleSubmit(async (values) => {
        // Handle submission
    });
    
    return { form, onSubmit, isLoading: false };
}
```

## Creating a New Feature

1. **Create directory structure**:
   ```bash
   mkdir -p features/my-feature/{components/{atoms,molecules,organisms},hooks,lib,server}
   ```

2. **Add AGENTS.md** with feature documentation

3. **Create schemas**:
   - `components/form-schemas.ts` - Form validation schemas (if feature has forms)
   - `server/schemas.ts` - RPC input/output schemas

4. **Create server module**:
   - `server/procedures.ts` - ORPC procedures
   - `server/index.ts` - Exports

5. **Register in router** (`integrations/rpc/router.ts`)

6. **Create components** following atomic design

7. **Create hooks** for form/business logic (if needed)

8. **Export from index.ts**

## Available Features

### `dashboard-auth`

Authentication flows for the admin dashboard:
- Login (email/OAuth)
- Forgot password
- Change password
- Welcome/first user setup

### `storage`

R2 storage operations:
- Presigned URL generation (upload/download/delete)
- Used by global upload hooks

### `visitor-home`

Public home page:
- Hero, features, testimonials, stats sections
- Storage demo section
- SSR and CSR examples

## Best Practices

1. **One feature, one domain**: Each feature handles one business domain
2. **Self-contained**: Features should minimize cross-feature dependencies
3. **Clear exports**: Use index.ts to define the public API
4. **Document with AGENTS.md**: Every feature needs documentation
5. **Separate schemas by purpose**: Form schemas in components/, server schemas in server/
6. **Schema-first**: Define schemas before implementing procedures
7. **Hooks for logic**: Separate business logic from presentation
