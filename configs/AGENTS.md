# Global Configs

## Purpose

Application-wide configuration constants and settings. These values are used across multiple features and should remain consistent throughout the application.

## Structure

```
configs/
├── AGENTS.md       # This documentation
├── constants.ts    # App constants (metadata, locales, cookies)
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
} from "@/configs/constants";
import type { Locale } from "@/configs/constants";
```

#### Available Constants

| Constant                | Type                       | Description                        |
| ----------------------- | -------------------------- | ---------------------------------- |
| `DEFAULT_ROOT_METADATA` | `Metadata`                 | Default Next.js metadata for pages |
| `COOKIE_NAMES`          | `{ LOCALE: "locale" }`     | Cookie name constants              |
| `LOCALES`               | `{ EN: "en", AR: "ar" }`   | Available locale identifiers       |
| `SUPPORTED_LOCALES`     | `["en", "ar"]`             | Array of supported locales         |
| `DEFAULT_LOCALE`        | `"en"`                     | Default locale when none is set    |
| `LOCALE_TIMEZONE`       | `Record<Locale, Timezone>` | Timezone mapping for each locale   |

#### Usage Example

```typescript
import { LOCALES, DEFAULT_LOCALE, LOCALE_TIMEZONE } from "@/configs/constants";
import type { Locale } from "@/configs/constants";

function getTimezone(locale: Locale): string {
    return LOCALE_TIMEZONE[locale];
}

// Check if locale is supported
const isArabic = locale === LOCALES.AR;
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

## Guidelines

- Use `as const` for object constants to get literal types
- Export types alongside constants when useful
- Keep configs flat and simple
- Avoid runtime-dependent values (use environment variables instead)
