import "server-only";

/**
 * R2 Server Integration
 *
 * Server-side R2 storage operations.
 *
 * Two clients available:
 * 1. R2 Binding (getR2Storage) - Direct binding for text/JSON operations
 * 2. S3 Client (getS3PresignedUrlGenerator) - For presigned URL generation
 */

// Binding-based storage (direct R2 access)
export { getR2Storage, getR2BindingStorage, resetR2Storage } from "./binding";

// S3-compatible client (presigned URLs)
export { getS3PresignedUrlGenerator, resetS3Client } from "./s3-client";
