# Dashboard Auth Feature

## Purpose

Handles the authentication flows for the admin dashboard: Login, Forgot Password, Change Password, and initial Welcome/First User setup.

## Structure

```
dashboard-auth/
├── AGENTS.md            # This documentation
├── index.ts             # Public exports (components, hooks, server)
├── components/          # Atomic design components
│   ├── index.ts         # Component exports
│   ├── form-schemas.ts  # Client-side form validation schemas
│   ├── atoms/           # Basic elements
│   │   └── password-strength-meter.tsx
│   ├── molecules/       # Simple groups
│   │   ├── auth-header.tsx
│   │   └── oauth-buttons.tsx
│   └── organisms/       # Complete forms
│       ├── login-form.tsx
│       ├── forgot-password-form.tsx
│       ├── change-password-form.tsx
│       └── welcome-form.tsx
├── hooks/               # Feature-specific React hooks
│   ├── index.ts         # Hook exports
│   ├── use-login-form.ts
│   ├── use-forgot-password-form.ts
│   ├── use-change-password-form.ts
│   └── use-welcome-form.ts
├── lib/                 # Feature-specific utilities
│   └── constants.ts     # Password/username length constants
└── server/              # Server-side logic
    ├── index.ts         # Server exports (dashboardAuthRoutes, schemas)
    ├── schemas.ts       # RPC input/output schemas
    └── procedures.ts    # ORPC procedures
```

## Key Patterns

### Form Hooks Pattern

All form logic is extracted into custom hooks in `hooks/`. Components only handle presentation.

**Hook Example** (`hooks/use-login-form.ts`):

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginFormSchema } from "@/features/dashboard-auth/components/form-schemas";
import { authClient } from "@/integrations/auth/client";

export function useLoginForm() {
    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: { email: "", password: "" },
    });

    const { mutateAsync: loginByEmail, isPending } = useMutation({
        mutationFn: async (param) => {
            return authClient.signIn.email({
                email: param.email,
                password: param.password,
                rememberMe: true,
                callbackURL: "/dashboard",
            });
        },
    });

    return {
        form,
        isLoading: isPending,
        onSubmitLoginByEmail: form.handleSubmit((v) => loginByEmail(v)),
    };
}
```

**Component Example** (`components/organisms/login-form.tsx`):

```tsx
"use client";

import { useLoginForm } from "../../hooks/use-login-form";

export function LoginForm() {
    const { form, isLoading, onSubmitLoginByEmail } = useLoginForm();
    
    return (
        <Form {...form}>
            <form onSubmit={onSubmitLoginByEmail}>
                {/* Form fields - presentation only */}
            </form>
        </Form>
    );
}
```

### Schema Organization

Schemas are separated by purpose:

**Form Schemas** (`components/form-schemas.ts`):
Client-side form validation schemas with user-friendly error messages.
- `loginFormSchema`, `forgotPasswordFormSchema`, `resetPasswordFormSchema`, `welcomeFormSchema`

```typescript
import {
    loginFormSchema,
    LoginFormType,
    welcomeFormSchema,
    WelcomeFormType,
} from "@/features/dashboard-auth/components/form-schemas";
```

**Server Schemas** (`server/schemas.ts`):
RPC input/output schemas for API validation.
- `createFirstUserInputSchema`, `authSessionResponseSchema`, `isFirstUserResponseSchema`

```typescript
import {
    createFirstUserInputSchema,
    CreateFirstUserInputType,
} from "@/features/dashboard-auth/server/schemas";
```

## Component Hierarchy

- **Atoms**: Pure presentational elements (`PasswordStrengthMeter`)
- **Molecules**: Reusable UI blocks (`AuthHeader`, `OAuthButtons`)
- **Organisms**: Complete forms with business logic via hooks

## Available RPC Procedures

| Procedure              | Description                       | Auth Required |
| ---------------------- | --------------------------------- | ------------- |
| `checkIsFirstTimeUser` | Returns true if no users exist    | No            |
| `getAuthSession`       | Returns current session and user  | No            |
| `createFirstUser`      | Creates the first superadmin user | No            |

### Usage

```typescript
// Server-side
import { serverRpc } from "@/integrations/rpc/server";

const { value: isFirstUser } = await serverRpc.dashboardAuth.checkIsFirstTimeUser();
const { session, user } = await serverRpc.dashboardAuth.getAuthSession();

// Client-side
import { orpc } from "@/integrations/rpc/client";

const { mutateAsync } = useMutation(
    orpc.dashboardAuth.createFirstUser.mutationOptions()
);
```

## Authentication Flow

1. **First Visit**: Check if any users exist via `checkIsFirstTimeUser`
2. **Welcome Flow**: If no users, show welcome form to create superadmin
3. **Login Flow**: Use email/password or OAuth (Google) login
4. **Forgot Password**: Request password reset email
5. **Change Password**: Update password (when reset token provided)

## Constants

Feature-specific constants in `lib/constants.ts`:

```typescript
export const constants = {
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 64,
    USERNAME_MIN_LENGTH: 6,
    USERNAME_MAX_LENGTH: 30,
};
```

## Adding New Auth Features

1. **Add form schema** in `components/form-schemas.ts` with `Type` suffix export
2. **Add server schema** in `server/schemas.ts` if RPC input/output needed
3. **Create hook** in `hooks/use-<feature>-form.ts` with form logic
4. **Create component** in `components/organisms/<feature>-form.tsx` (presentation only)
5. **Add RPC procedure** in `server/procedures.ts` if server-side logic needed
6. **Export** from respective index files
