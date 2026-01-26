# Dashboard Feature

## Purpose

Core dashboard layout and navigation components including:

- Collapsible sidebar with menu navigation
- Top navbar with logo and theme switcher
- User dropdown with profile and logout actions

## Structure

```
dashboard/
├── AGENTS.md                    # This documentation
├── index.ts                     # Public exports
├── lib/
│   └── constants.ts             # Sidebar menu configuration
└── components/
    ├── index.ts                 # Component exports
    ├── atoms/
    │   ├── index.ts
    │   ├── logo.tsx             # Application logo
    │   └── theme-switcher.tsx   # Dark/light mode toggle
    ├── molecules/
    │   ├── index.ts
    │   ├── nav-main.tsx         # Main navigation with collapsible items
    │   └── nav-user.tsx         # User dropdown (avatar, logout, profile)
    ├── organisms/
    │   ├── index.ts
    │   ├── app-sidebar.tsx      # Complete sidebar component
    │   └── dashboard-navbar.tsx # Top navbar
    └── templates/
        ├── index.ts
        └── dashboard-layout.tsx # Full dashboard layout wrapper
```

## Usage

### Dashboard Layout

The `DashboardLayout` component wraps all dashboard pages:

```tsx
import { DashboardLayout } from "@/features/dashboard";

export default function Layout({ children }) {
    return <DashboardLayout>{children}</DashboardLayout>;
}
```

### Menu Configuration

Sidebar menu items are configured in `lib/constants.ts`:

```tsx
import { SIDEBAR_MENU_ITEMS } from "@/features/dashboard/lib/constants";

// Each item has:
// - title: Display name
// - url: Navigation path
// - icon: Lucide icon component
// - items?: Optional sub-menu items
```

## Dependencies

- `@/components/ui/sidebar` - Sidebar primitives
- `@/components/ui/dropdown-menu` - User dropdown
- `@/components/ui/avatar` - User avatar
- `@/components/ui/collapsible` - Collapsible menu items
- `@/integrations/auth/client` - Auth client for logout
- `next-themes` - Theme switching

## Key Patterns

### Session Access

User data is passed from the server-side layout via props:

```tsx
// In layout.tsx (server component)
const session = await serverRpc.dashboardAuth.getAuthSession();

// Pass to DashboardLayout
<DashboardLayout user={session?.user}>
    {children}
</DashboardLayout>
```

### Theme Switching

Uses `next-themes` with system preference support:

```tsx
import { useTheme } from "next-themes";

const { theme, setTheme } = useTheme();
```

### Sidebar Collapsibility

Sidebar state is managed by `SidebarProvider` with keyboard shortcut (Cmd/Ctrl+B):

- Desktop: Collapses to icon-only mode
- Mobile: Opens as sheet overlay
