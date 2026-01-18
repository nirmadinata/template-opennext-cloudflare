/**
 * R2 Storage Integration
 *
 * Provides access to Cloudflare R2 storage with:
 * - Server-side text/JSON operations via R2 binding
 * - Presigned URL generation via S3-compatible API (aws4fetch)
 * - Client-side upload helpers
 *
 * Server-only: import from "@/integrations/r2/server"
 * Client-only: import from "@/integrations/r2/client"
 * Shared (types, constants): import from "@/integrations/r2"
 *
 * @example Server-side text storage:
 * ```ts
 * import { getCFContext } from "@/integrations/cloudflare-context/server";
 * import { getR2Storage } from "@/integrations/r2/server";
 *
 * const { env } = await getCFContext();
 * const storage = getR2Storage(env);
 *
 * await storage.setJson("config/settings.json", { theme: "dark" });
 * const settings = await storage.getJson("config/settings.json");
 * ```
 *
 * @example Server-side presigned URL:
 * ```ts
 * import { getS3PresignedUrlGenerator } from "@/integrations/r2/server";
 *
 * const generator = getS3PresignedUrlGenerator();
 * const { url } = await generator.generateUploadUrl({
 *     key: "uploads/avatar.jpg",
 *     contentType: "image/jpeg",
 * });
 * ```
 *
 * @example Client-side upload:
 * ```tsx
 * import { uploadToPresignedUrl } from "@/integrations/r2/client";
 *
 * const result = await uploadToPresignedUrl({
 *     url: presignedUrl,
 *     file: selectedFile,
 *     onProgress: ({ percentage }) => setProgress(percentage),
 * });
 * ```
 */

// Types
export type {
    PresignedUrlOptions,
    PresignedUrlResult,
    R2TextOptions,
    R2GetResult,
    R2TextStorage,
    R2PresignedUrlGenerator,
    R2StorageClient,
    UploadProgressCallback,
    ClientUploadOptions,
    ClientUploadResult,
} from "./types";

// Constants
export {
    DEFAULT_PRESIGNED_URL_EXPIRY,
    MIN_PRESIGNED_URL_EXPIRY,
    MAX_PRESIGNED_URL_EXPIRY,
    R2_PATHS,
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZES,
    buildR2Key,
} from "./constants";
