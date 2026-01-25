# Global Hooks

## Purpose

Reusable React hooks that work across all features. These hooks encapsulate common stateful logic that is not specific to any single feature.

## Structure

```
hooks/
├── AGENTS.md                    # This documentation
├── index.ts                     # Barrel exports for all hooks
├── use-mobile.ts                # Responsive breakpoint detection
├── use-upload.ts                # Simple file upload (no progress)
└── use-upload-with-progress.ts  # File upload with progress tracking
```

## Available Hooks

### `useIsMobile`

Detects if the viewport is below the mobile breakpoint (768px).

```tsx
import { useIsMobile } from "@/hooks";

function MyComponent() {
    const isMobile = useIsMobile();

    return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
```

### `useUpload`

Simple file upload hook without progress tracking. Best for small files where progress feedback isn't necessary.

```tsx
import { useUpload } from "@/hooks";

function MyComponent() {
    const { upload, isUploading, uploadedKey, error, reset } = useUpload({
        path: "uploads/avatars",
        filename: "custom-name.jpg", // Optional, auto-generates if not provided
        onSuccess: (key) => console.log(`Uploaded: ${key}`),
        onError: (err) => console.error(err),
        invalidateKeys: ["storage"], // Query keys to invalidate on success
    });

    const handleUpload = async (file: File) => {
        const key = await upload(file);
        if (key) {
            // Handle success
        }
    };

    return (
        <button onClick={() => handleUpload(file)} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
        </button>
    );
}
```

### `useUploadWithProgress`

File upload hook with real-time progress tracking and cancellation support. Best for larger files or when user feedback is important.

```tsx
import { useUploadWithProgress } from "@/hooks";

function MyComponent() {
    const { upload, cancel, reset, isUploading, progress, uploadedKey, error } =
        useUploadWithProgress({
            path: "uploads/documents",
            onProgress: (p) => console.log(`${p.percentage}%`),
            onSuccess: (key) => console.log(`Uploaded: ${key}`),
        });

    return (
        <div>
            <button onClick={() => upload(file)} disabled={isUploading}>
                {isUploading ? `${progress.percentage}%` : "Upload"}
            </button>
            {isUploading && <button onClick={cancel}>Cancel</button>}
            <div
                className="progress-bar"
                style={{ width: `${progress.percentage}%` }}
            />
        </div>
    );
}
```

## Hook Options

### Common Upload Options

Both `useUpload` and `useUploadWithProgress` share these options:

| Option           | Type                     | Default            | Description                                    |
| ---------------- | ------------------------ | ------------------ | ---------------------------------------------- |
| `path`           | `string`                 | `R2_PATHS.UPLOADS` | R2 path for uploads (e.g., `"uploads/photos"`) |
| `filename`       | `string`                 | Auto-generated     | Optional custom filename                       |
| `expiresIn`      | `number`                 | `3600`             | Presigned URL expiration in seconds            |
| `onSuccess`      | `(key: string) => void`  | -                  | Callback when upload succeeds                  |
| `onError`        | `(error: Error) => void` | -                  | Callback when upload fails                     |
| `invalidateKeys` | `string[]`               | `["storage"]`      | TanStack Query keys to invalidate on success   |

### Additional Options for `useUploadWithProgress`

| Option       | Type                                 | Description                    |
| ------------ | ------------------------------------ | ------------------------------ |
| `onProgress` | `(progress: UploadProgress) => void` | Callback when progress changes |

### Return Values

#### `useUpload` returns:

| Property      | Type                              | Description                   |
| ------------- | --------------------------------- | ----------------------------- |
| `upload`      | `(file: File) => Promise<string>` | Function to trigger upload    |
| `isUploading` | `boolean`                         | Whether upload is in progress |
| `uploadedKey` | `string \| null`                  | Key of last uploaded file     |
| `error`       | `string \| null`                  | Error message if failed       |
| `reset`       | `() => void`                      | Reset upload state            |

#### `useUploadWithProgress` additionally returns:

| Property   | Type             | Description             |
| ---------- | ---------------- | ----------------------- |
| `progress` | `UploadProgress` | Current upload progress |
| `cancel`   | `() => void`     | Cancel current upload   |

### UploadProgress Type

```typescript
interface UploadProgress {
    loaded: number;     // Bytes loaded so far
    total: number;      // Total bytes to upload
    percentage: number; // Percentage complete (0-100)
}
```

## When to Add Hooks Here

Add a hook to this global folder when:

- ✅ The logic is reusable across multiple features
- ✅ It's not tied to any specific feature's business domain
- ✅ It encapsulates common patterns (uploads, responsive design, etc.)

Keep hooks in feature folders (`features/<feature>/hooks/`) when:

- ❌ The logic is unique to a specific feature
- ❌ It's tightly coupled to feature-specific data or components
- ❌ It wouldn't make sense in other contexts

## Adding New Hooks

1. Create the hook file: `hooks/use-<name>.ts`
2. Add `"use client";` directive at the top (for client-side hooks)
3. Export the hook and its types from `hooks/index.ts`
4. Update this documentation with usage examples

### Hook Template

```typescript
"use client";

import { useState, useCallback } from "react";

export interface UseMyHookOptions {
    /** Option description */
    option1?: string;
    /** Callback when something happens */
    onSuccess?: (result: string) => void;
}

export interface UseMyHookReturn {
    /** Current state */
    data: string | null;
    /** Whether operation is in progress */
    isLoading: boolean;
    /** Trigger the operation */
    execute: () => Promise<void>;
    /** Reset state */
    reset: () => void;
}

/**
 * useMyHook - Description of what this hook does
 *
 * @example
 * ```tsx
 * const { data, isLoading, execute } = useMyHook({
 *     option1: "value",
 *     onSuccess: (result) => console.log(result),
 * });
 * ```
 */
export function useMyHook(options: UseMyHookOptions = {}): UseMyHookReturn {
    const { option1, onSuccess } = options;
    const [data, setData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(async () => {
        setIsLoading(true);
        try {
            // Do something
            const result = "result";
            setData(result);
            onSuccess?.(result);
        } finally {
            setIsLoading(false);
        }
    }, [option1, onSuccess]);

    const reset = useCallback(() => {
        setData(null);
        setIsLoading(false);
    }, []);

    return { data, isLoading, execute, reset };
}
```

## Integration with R2 Storage

The upload hooks integrate with the R2 storage system:

1. **Generate presigned URL** via RPC (`orpc.storage.generateUploadUrl`)
2. **Upload to presigned URL** via `uploadToPresignedUrl` from `@/integrations/r2/client`
3. **Use R2 path constants** from `@/integrations/r2` for consistent naming

```typescript
import { R2_PATHS, buildR2Key } from "@/integrations/r2";

// Build consistent keys
const key = buildR2Key(R2_PATHS.USER_UPLOADS, userId, "avatar.jpg");
// Result: "uploads/users/{userId}/avatar.jpg"
```
