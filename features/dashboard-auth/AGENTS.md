# Dashboard Auth Feature

## Purpose

Handles the authentication flows for the dashboard: Login, Forgot Password, and Change Password.

## Structure

```
dashboard-auth/
├── components/          # Atomic design components
│   ├── atoms/           # Basic elements
│   ├── molecules/       # Groups (AuthHeader, OAuthButtons)
│   └── organisms/       # Forms (LoginForm, ForgotPasswordForm, ChangePasswordForm)
├── hooks/               # Feature-specific React hooks (Form logic, Auth logic)
├── lib/                 # Feature-specific utilities and constants
└── server/              # Server-side logic
```

## Key Patterns

### Form Hooks Pattern

All form logic must be extracted into custom hooks located in `hooks/`. Components should only handle presentation.

**Example:**

`useLogin.ts`:

```typescript
export function useLogin() {
    const form = useForm({ ... });
    // ... logic
    return { form, isLoading, onSubmit };
}
```

`LoginForm.tsx`:

```tsx
export function LoginForm() {
    const { form, isLoading, onSubmit } = useLogin();
    return <Form {...form}>{/* ... UI */}</Form>;
}
```

## Component Hierarchy

- **Atoms**: Pure presentational elements.
- **Molecules**: Reusable UI blocks like `AuthHeader`.
- **Organisms**: Complete forms or sections.
