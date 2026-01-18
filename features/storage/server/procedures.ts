import {
    GenerateDownloadUrlInputSchema,
    GenerateUploadUrlInputSchema,
    PresignedUrlResponseSchema,
} from "./schemas";
import { getS3PresignedUrlGenerator } from "@/integrations/r2/server";
import { publicProcedure } from "@/integrations/rpc";

/**
 * Generate Upload Presigned URL
 *
 * Creates a presigned URL for client-side file uploads to R2.
 * The URL can be used with PUT request to upload the file directly.
 *
 * @example
 * ```ts
 * const { url, key, expiresAt } = await serverRpc.storage.generateUploadUrl({
 *     key: "uploads/users/123/avatar.jpg",
 *     contentType: "image/jpeg",
 *     expiresIn: 3600,
 * });
 * ```
 */
export const generateUploadUrl = publicProcedure
    .input(GenerateUploadUrlInputSchema)
    .output(PresignedUrlResponseSchema)
    .handler(async ({ input }) => {
        const generator = getS3PresignedUrlGenerator();

        const result = await generator.generateUploadUrl({
            key: input.key,
            contentType: input.contentType,
            contentLength: input.contentLength,
            expiresIn: input.expiresIn,
        });

        return result;
    });

/**
 * Generate Download Presigned URL
 *
 * Creates a presigned URL for client-side file downloads from R2.
 * The URL can be used with GET request to download the file directly.
 *
 * @example
 * ```ts
 * const { url, key, expiresAt } = await serverRpc.storage.generateDownloadUrl({
 *     key: "uploads/users/123/avatar.jpg",
 *     expiresIn: 3600,
 * });
 * ```
 */
export const generateDownloadUrl = publicProcedure
    .input(GenerateDownloadUrlInputSchema)
    .output(PresignedUrlResponseSchema)
    .handler(async ({ input }) => {
        const generator = getS3PresignedUrlGenerator();

        const result = await generator.generateDownloadUrl({
            key: input.key,
            expiresIn: input.expiresIn,
        });

        return result;
    });

/**
 * Generate Delete Presigned URL
 *
 * Creates a presigned URL for client-side file deletion from R2.
 * The URL can be used with DELETE request to remove the file.
 *
 * @example
 * ```ts
 * const { url, key, expiresAt } = await serverRpc.storage.generateDeleteUrl({
 *     key: "uploads/users/123/avatar.jpg",
 *     expiresIn: 300,
 * });
 * ```
 */
export const generateDeleteUrl = publicProcedure
    .input(GenerateDownloadUrlInputSchema) // Same schema as download
    .output(PresignedUrlResponseSchema)
    .handler(async ({ input }) => {
        const generator = getS3PresignedUrlGenerator();

        const result = await generator.generateDeleteUrl({
            key: input.key,
            expiresIn: input.expiresIn,
        });

        return result;
    });
