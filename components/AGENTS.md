# Global Components

## Purpose

Reusable UI components shared across all features. These are not feature-specific and can be used anywhere in the application.

## Structure

```
components/
├── AGENTS.md           # This documentation
├── molecules/          # Composite client components (providers, handlers)
│   ├── client-provider.tsx
│   └── locale-change-handler.tsx
└── ui/                 # UI primitives (Radix-based)
    ├── button.tsx
    ├── input.tsx
    ├── dialog.tsx
    └── ... (50+ components)
```

## Directories

### `ui/` - UI Primitives

Low-level, reusable UI components built on:

- **Radix UI** primitives for accessibility
- **class-variance-authority (CVA)** for variants
- **Tailwind CSS v4** for styling

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function MyComponent() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Open</Button>
            </DialogTrigger>
            <DialogContent>
                <Input placeholder="Enter text..." />
            </DialogContent>
        </Dialog>
    );
}
```

### `molecules/` - Composite Components

Higher-level components that combine UI primitives with specific functionality:

#### `ClientProvider`

Root provider for all client-side state management:

```tsx
// app/layout.tsx
import { ClientProvider } from "@/components/molecules/client-provider";

export default function RootLayout({ children }) {
    return (
        <html>
            <body>
                <ClientProvider>{children}</ClientProvider>
            </body>
        </html>
    );
}
```

Includes:

- TanStack Query provider
- TanStack Devtools
- Locale change handler

#### `LocaleChangeHandler`

Handles locale changes and refreshes the page when locale cookie changes.

## Adding New Components

### UI Components

1. Create file in `components/ui/<name>.tsx`
2. Use Radix UI primitives when possible
3. Use CVA for variant management
4. Export from the file directly (no barrel export needed)

```tsx
// components/ui/my-component.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const myComponentVariants = cva("base-classes", {
    variants: {
        variant: {
            default: "default-classes",
            outline: "outline-classes",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface MyComponentProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof myComponentVariants> {}

export function MyComponent({
    className,
    variant,
    ...props
}: MyComponentProps) {
    return (
        <div
            className={cn(myComponentVariants({ variant }), className)}
            {...props}
        />
    );
}
```

### Molecule Components

1. Create file in `components/molecules/<name>.tsx`
2. Add `"use client";` if it uses React hooks
3. Combine UI primitives with specific logic

## Guidelines

- **UI components**: Pure, stateless, no business logic
- **Molecules**: Can have state, but should remain generic
- **Feature-specific components**: Go in `features/<feature>/components/`
