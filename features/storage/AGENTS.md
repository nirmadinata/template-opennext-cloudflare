# Storage Feature

## Purpose

Generic R2 storage RPC procedures for presigned URL generation. This feature provides reusable storage operations that can be consumed by any other feature.

## Structure

```
storage/
├── server/
│   ├── schemas.ts     # Zod schemas for storage operations
│   ├── procedures.ts  # RPC procedures (presigned URL generation)
│   └── index.ts       # Server exports (exports storageRoutes)
└── index.ts           # Public exports
```

## Available Procedures

### generateUploadUrl

Generates a presigned URL for client-side file uploads.

```typescript
const { url, key, expiresAt } = await serverRpc.storage.generateUploadUrl({
    key: "uploads/users/123/avatar.jpg",
    contentType: "image/jpeg",
    contentLength: 1024000, // optional
    expiresIn: 3600, // optional, defaults to 1 hour
});
```

### generateDownloadUrl

Generates a presigned URL for client-side file downloads.

```typescript
const { url, key, expiresAt } = await serverRpc.storage.generateDownloadUrl({
    key: "uploads/users/123/avatar.jpg",
    expiresIn: 3600, // optional
});
```

### generateDeleteUrl

Generates a presigned URL for client-side file deletion.

```typescript
const { url, key, expiresAt } = await serverRpc.storage.generateDeleteUrl({
    key: "uploads/users/123/avatar.jpg",
    expiresIn: 300, // optional
});
```

## Client-Side Usage

### With TanStack Query (via orpc)

```typescript
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/integrations/rpc/client";
import { uploadToPresignedUrl } from "@/integrations/r2/client";

// Get presigned URL
const generateUrlMutation = useMutation({
    mutationFn: async (file: File) => {
        return orpc.storage.generateUploadUrl.call({
            key: `uploads/${file.name}`,
            contentType: file.type,
        });
    },
});

// Upload file
const { url, key } = await generateUrlMutation.mutateAsync(file);
await uploadToPresignedUrl({ url, file, contentType: file.type });
```

## Path Constants

Use constants from `@/integrations/r2` for consistent path naming:

```typescript
import { R2_PATHS, buildR2Key } from "@/integrations/r2";

// Available paths
R2_PATHS.UPLOADS; // "uploads"
R2_PATHS.USER_UPLOADS; // "uploads/users"
R2_PATHS.PUBLIC; // "public"
R2_PATHS.TEMP; // "temp"
R2_PATHS.DATA; // "data"
R2_PATHS.CONFIG; // "config"
R2_PATHS.MEDIA; // "media"
R2_PATHS.MEDIA_IMAGES; // "media/images"
R2_PATHS.MEDIA_VIDEOS; // "media/videos"

// Build keys
const key = buildR2Key(R2_PATHS.USER_UPLOADS, userId, "avatar.jpg");
// Result: "uploads/users/{userId}/avatar.jpg"
```

## Validation Constants

```typescript
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZES } from "@/integrations/r2";

// MIME type groups
ALLOWED_MIME_TYPES.IMAGES; // ["image/jpeg", "image/png", ...]
ALLOWED_MIME_TYPES.DOCUMENTS; // ["application/pdf", ...]
ALLOWED_MIME_TYPES.JSON; // ["application/json"]

// Size limits (bytes)
MAX_FILE_SIZES.IMAGE; // 5MB
MAX_FILE_SIZES.DOCUMENT; // 10MB
MAX_FILE_SIZES.VIDEO; // 100MB
MAX_FILE_SIZES.DATA; // 1MB
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
