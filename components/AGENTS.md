# Global Components

## Purpose

Reusable UI components shared across all features. These are not feature-specific and can be used anywhere in the application.

## Structure

```
components/
├── AGENTS.md           # This documentation
├── molecules/          # Composite client components (providers, handlers)
│   ├── client-provider.tsx    # Root provider for client-side state
│   └── locale-change-handler.tsx
└── ui/                 # UI primitives (Radix-based)
    ├── button.tsx
    ├── input.tsx
    ├── dialog.tsx
    ├── form.tsx
    ├── card.tsx
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

- TanStack Query provider with devtools
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
        size: {
            sm: "small-classes",
            md: "medium-classes",
            lg: "large-classes",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "md",
    },
});

export interface MyComponentProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof myComponentVariants> {}

export function MyComponent({
    className,
    variant,
    size,
    ...props
}: MyComponentProps) {
    return (
        <div
            className={cn(myComponentVariants({ variant, size }), className)}
            {...props}
        />
    );
}
```

### Molecule Components

1. Create file in `components/molecules/<name>.tsx`
2. Add `"use client";` if it uses React hooks
3. Combine UI primitives with specific logic

```tsx
// components/molecules/confirmation-dialog.tsx
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationDialogProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationDialog({
    title,
    message,
    onConfirm,
    onCancel,
}: ConfirmationDialogProps) {
    return (
        <Dialog open>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <p>{message}</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={onConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
```

## Guidelines

- **UI components**: Pure, stateless, no business logic
- **Molecules**: Can have state, but should remain generic
- **Feature-specific components**: Go in `features/<feature>/components/`
- **Use `cn()` utility**: For merging Tailwind classes with conditionals
- **Forward refs when needed**: For components that need ref access

## Available UI Components

Key components available in `components/ui/`:

| Component       | Description                          |
| --------------- | ------------------------------------ |
| `Button`        | Primary action button with variants  |
| `Input`         | Text input field                     |
| `Form`          | Form primitives with react-hook-form |
| `Dialog`        | Modal dialog                         |
| `Card`          | Content container                    |
| `Select`        | Dropdown select                      |
| `Table`         | Data table components                |
| `Tabs`          | Tabbed navigation                    |
| `Skeleton`      | Loading placeholder                  |
| `Spinner`       | Loading indicator                    |
| `Empty`         | Empty state component                |
| `Sonner`        | Toast notifications (via sonner)     |
| `Sidebar`       | Navigation sidebar                   |
| `Sheet`         | Slide-out panel                      |
| `Dropdown Menu` | Context/dropdown menus               |

## Form Integration

Forms use React Hook Form with Zod validation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
    email: z.email("Invalid email"),
});

function MyForm() {
    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues: { email: "" },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
```
