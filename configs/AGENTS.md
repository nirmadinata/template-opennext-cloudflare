# Global Configs

## Purpose

Application-wide configuration constants and settings. These values are used across multiple features and should remain consistent throughout the application.

## Structure

```
configs/
├── AGENTS.md       # This documentation
├── constants.ts    # App constants (metadata, locales, roles)
└── fonts.ts        # Font configurations
```

## Files

### `constants.ts`

Application-wide constants:

```typescript
import {
    DEFAULT_ROOT_METADATA,
    COOKIE_NAMES,
    LOCALES,
    SUPPORTED_LOCALES,
    DEFAULT_LOCALE,
    LOCALE_TIMEZONE,
    ROLE_ENUM,
    DEFAULT_CREATED_ROLE,
} from "@/configs/constants";
import type { Locale } from "@/configs/constants";
```

#### Available Constants

| Constant                | Type                            | Description                        |
| ----------------------- | ------------------------------- | ---------------------------------- |
| `DEFAULT_ROOT_METADATA` | `Metadata`                      | Default Next.js metadata for pages |
| `COOKIE_NAMES`          | `{ LOCALE: "locale" }`          | Cookie name constants              |
| `LOCALES`               | `{ EN: "en", AR: "ar" }`        | Available locale identifiers       |
| `SUPPORTED_LOCALES`     | `["en", "ar"]`                  | Array of supported locales         |
| `DEFAULT_LOCALE`        | `"en"`                          | Default locale when none is set    |
| `LOCALE_TIMEZONE`       | `Record<Locale, Timezone>`      | Timezone mapping for each locale   |
| `ROLE_ENUM`             | `{ SYSTEM, SUPERADMIN, ADMIN }` | User role constants                |
| `DEFAULT_CREATED_ROLE`  | `"admin"`                       | Default role for new users         |

#### Usage Example

```typescript
import { LOCALES, DEFAULT_LOCALE, LOCALE_TIMEZONE, ROLE_ENUM } from "@/configs/constants";
import type { Locale } from "@/configs/constants";

function getTimezone(locale: Locale): string {
    return LOCALE_TIMEZONE[locale];
}

// Check if locale is supported
const isArabic = locale === LOCALES.AR;

// Check user role
if (user.role === ROLE_ENUM.SUPERADMIN) {
    // Grant full access
}
```

### `fonts.ts`

Font configurations using `next/font/google`:

```typescript
import { geistSans, geistMono } from "@/configs/fonts";

// In layout.tsx
<body className={`${geistSans.variable} ${geistMono.variable}`}>
```

#### Available Fonts

| Font        | Variable            | Description        |
| ----------- | ------------------- | ------------------ |
| `geistSans` | `--font-geist-sans` | Primary sans-serif |
| `geistMono` | `--font-geist-mono` | Monospace font     |

## Adding New Configs

### Constants

Add to `constants.ts` when:

- The value is used across multiple features
- It's a configuration that shouldn't change at runtime
- It defines application-wide behavior

```typescript
// configs/constants.ts
export const API_CONFIG = {
    TIMEOUT: 30000,
    RETRY_COUNT: 3,
} as const;
```

### Fonts

Add to `fonts.ts` when adding new fonts:

```typescript
// configs/fonts.ts
import { Inter } from "next/font/google";

export const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});
```

Then use in layout:

```tsx
// app/layout.tsx
import { inter } from "@/configs/fonts";

<body className={inter.variable}>
```

## Guidelines

- Use `as const` for object constants to get literal types
- Export types alongside constants when useful
- Keep configs flat and simple
- Avoid runtime-dependent values (use environment variables instead)
- Group related constants in objects for better organization

## Related Constants in Other Locations

Some constants are defined in integration-specific locations:

| Location                         | Contains                                  |
| -------------------------------- | ----------------------------------------- |
| `integrations/auth/constants.ts` | Auth-specific constants (APP_NAME, paths) |
| `integrations/db/constants.ts`   | Database table/column aliases             |
| `integrations/r2/constants.ts`   | R2 paths, MIME types, file size limits    |

When adding new constants, consider:

- **Global**: affects multiple features → `configs/constants.ts`
- **Integration-specific**: only used by one integration → `integrations/<name>/constants.ts`
- **Feature-specific**: only used within one feature → `features/<name>/lib/constants.ts`
