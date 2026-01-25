# Storage Feature

## Purpose

Generic R2 storage RPC procedures for presigned URL generation. This feature provides reusable storage operations that can be consumed by any other feature.

## Structure

```
storage/
├── AGENTS.md            # This documentation
├── index.ts             # Public exports (server)
└── server/
    ├── index.ts         # Server exports (storageRoutes)
    ├── schemas.ts       # Zod schemas for storage operations
    └── procedures.ts    # RPC procedures
```

## Available Procedures

### `generateUploadUrl`

Generates a presigned URL for client-side file uploads.

```typescript
const { url, key, expiresAt } = await serverRpc.storage.generateUploadUrl({
    key: "uploads/users/123/avatar.jpg",
    contentType: "image/jpeg",
    contentLength: 1024000, // optional
    expiresIn: 3600, // optional, defaults to 1 hour
});
```

### `generateDownloadUrl`

Generates a presigned URL for client-side file downloads.

```typescript
const { url, key, expiresAt } = await serverRpc.storage.generateDownloadUrl({
    key: "uploads/users/123/avatar.jpg",
    expiresIn: 3600, // optional
});
```

### `generateDeleteUrl`

Generates a presigned URL for client-side file deletion.

```typescript
const { url, key, expiresAt } = await serverRpc.storage.generateDeleteUrl({
    key: "uploads/users/123/avatar.jpg",
    expiresIn: 300, // optional
});
```

## Schemas

### Input Schemas

| Schema                           | Description                     |
| -------------------------------- | ------------------------------- |
| `GenerateUploadUrlInputSchema`   | Upload URL request parameters   |
| `GenerateDownloadUrlInputSchema` | Download URL request parameters |

### Response Schema

```typescript
// PresignedUrlResponseSchema
{
    url: string;       // The presigned URL
    key: string;       // The storage key/path
    expiresAt: number; // Expiration timestamp (Unix ms)
}
```

## Client-Side Usage

### With Global Upload Hooks

The easiest way to handle uploads is using the global hooks:

```typescript
import { useUpload, useUploadWithProgress } from "@/hooks";

// Simple upload
const { upload, isUploading } = useUpload({
    path: "uploads/avatars",
    onSuccess: (key) => console.log(`Uploaded: ${key}`),
});

// Upload with progress
const { upload, progress, cancel } = useUploadWithProgress({
    path: "uploads/documents",
    onProgress: (p) => console.log(`${p.percentage}%`),
});
```

### Direct RPC Usage

For custom upload flows:

```typescript
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/integrations/rpc/client";
import { uploadToPresignedUrl } from "@/integrations/r2/client";

function CustomUpload() {
    // Get presigned URL
    const generateUrlMutation = useMutation({
        mutationFn: async (file: File) => {
            return orpc.storage.generateUploadUrl.call({
                key: `uploads/${file.name}`,
                contentType: file.type,
            });
        },
    });

    const handleUpload = async (file: File) => {
        // 1. Get presigned URL
        const { url, key } = await generateUrlMutation.mutateAsync(file);
        
        // 2. Upload file
        await uploadToPresignedUrl({
            url,
            file,
            contentType: file.type,
            onProgress: ({ percentage }) => console.log(`${percentage}%`),
        });
        
        console.log(`Uploaded to: ${key}`);
    };
}
```

## Path Constants

Use constants from `@/integrations/r2` for consistent path naming:

```typescript
import { R2_PATHS, buildR2Key } from "@/integrations/r2";

// Available paths
R2_PATHS.UPLOADS        // "uploads"
R2_PATHS.USER_UPLOADS   // "uploads/users"
R2_PATHS.PUBLIC         // "public"
R2_PATHS.TEMP           // "temp"
R2_PATHS.DATA           // "data"
R2_PATHS.CONFIG         // "config"
R2_PATHS.MEDIA          // "media"
R2_PATHS.MEDIA_IMAGES   // "media/images"
R2_PATHS.MEDIA_VIDEOS   // "media/videos"

// Build keys
const key = buildR2Key(R2_PATHS.USER_UPLOADS, userId, "avatar.jpg");
// Result: "uploads/users/{userId}/avatar.jpg"
```

## Validation Constants

```typescript
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZES } from "@/integrations/r2";

// MIME type groups
ALLOWED_MIME_TYPES.IMAGES      // ["image/jpeg", "image/png", ...]
ALLOWED_MIME_TYPES.DOCUMENTS   // ["application/pdf", ...]
ALLOWED_MIME_TYPES.JSON        // ["application/json"]

// Size limits (bytes)
MAX_FILE_SIZES.IMAGE     // 5MB
MAX_FILE_SIZES.DOCUMENT  // 10MB
MAX_FILE_SIZES.VIDEO     // 100MB
MAX_FILE_SIZES.DATA      // 1MB
```

## Client-Side Validation

```typescript
import { validateFileType, validateFileSize, formatBytes } from "@/integrations/r2/client";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZES } from "@/integrations/r2";

function validateFile(file: File): string | null {
    if (!validateFileType(file, ALLOWED_MIME_TYPES.IMAGES)) {
        return "Only image files are allowed";
    }
    if (!validateFileSize(file, MAX_FILE_SIZES.IMAGE)) {
        return `File must be smaller than ${formatBytes(MAX_FILE_SIZES.IMAGE)}`;
    }
    return null; // Valid
}
```

## Environment Requirements

The storage procedures require these environment variables:

```bash
# Required for S3-compatible API (presigned URLs)
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

Generate R2 API credentials in Cloudflare Dashboard > R2 > Manage R2 API Tokens.

## Adding New Storage Operations

1. **Add schema** in `server/schemas.ts` with input/output types
2. **Create procedure** in `server/procedures.ts`:

```typescript
import { base } from "@/integrations/rpc";
import { getS3PresignedUrlGenerator } from "@/integrations/r2/server";
import { MyInputSchema, MyOutputSchema } from "./schemas";

export const myStorageOperation = base
    .input(MyInputSchema)
    .output(MyOutputSchema)
    .handler(async ({ input }) => {
        const generator = getS3PresignedUrlGenerator();
        // Implement operation
        return result;
    });
```

3. **Export** from `server/index.ts` (auto-exported via `storageRoutes`)

## Integration with Other Features

This feature is designed to be consumed by other features. Example integration in visitor-home:

```typescript
// features/visitor-home/components/molecules/file-upload-card.tsx
import { useUploadWithProgress } from "@/hooks";

export function FileUploadCard() {
    const { upload, progress, isUploading } = useUploadWithProgress({
        path: "uploads/demo",
        onSuccess: (key) => console.log(`Uploaded: ${key}`),
    });
    
    // The hook internally uses storage.generateUploadUrl
    // ...
}
```
