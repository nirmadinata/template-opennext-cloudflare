import { z } from "zod";

import {
    ALLOWED_MIME_TYPES,
    DEFAULT_PRESIGNED_URL_EXPIRY,
    MAX_FILE_SIZES,
    MAX_PRESIGNED_URL_EXPIRY,
    MIN_PRESIGNED_URL_EXPIRY,
} from "@/integrations/r2/constants";

/**
 * Schema for requesting an upload presigned URL
 */
export const GenerateUploadUrlInputSchema = z.object({
    /**
     * The key/path where the file will be stored
     * Should include the full path, e.g., "uploads/users/123/avatar.jpg"
     */
    key: z.string().min(1).max(1024),

    /**
     * The MIME type of the file being uploaded
     */
    contentType: z.string().min(1).max(255),

    /**
     * Optional: File size in bytes (for validation)
     */
    contentLength: z.number().int().positive().optional(),

    /**
     * URL expiration time in seconds (default: 3600)
     */
    expiresIn: z
        .number()
        .int()
        .min(MIN_PRESIGNED_URL_EXPIRY)
        .max(MAX_PRESIGNED_URL_EXPIRY)
        .default(DEFAULT_PRESIGNED_URL_EXPIRY),
});

export type GenerateUploadUrlInputType = z.infer<
    typeof GenerateUploadUrlInputSchema
>;

/**
 * Schema for requesting a download presigned URL
 */
export const GenerateDownloadUrlInputSchema = z.object({
    /**
     * The key/path of the file to download
     */
    key: z.string().min(1).max(1024),

    /**
     * URL expiration time in seconds (default: 3600)
     */
    expiresIn: z
        .number()
        .int()
        .min(MIN_PRESIGNED_URL_EXPIRY)
        .max(MAX_PRESIGNED_URL_EXPIRY)
        .default(DEFAULT_PRESIGNED_URL_EXPIRY),
});

export type GenerateDownloadUrlInputType = z.infer<
    typeof GenerateDownloadUrlInputSchema
>;

/**
 * Schema for presigned URL response
 */
export const PresignedUrlResponseSchema = z.object({
    /**
     * The presigned URL
     */
    url: z.string().url(),

    /**
     * The key/path used
     */
    key: z.string(),

    /**
     * Expiration timestamp (Unix ms)
     */
    expiresAt: z.number(),
});

export type PresignedUrlResponseType = z.infer<
    typeof PresignedUrlResponseSchema
>;

/**
 * Common content types for validation
 */
export const CONTENT_TYPES = {
    IMAGES: ALLOWED_MIME_TYPES.IMAGES,
    DOCUMENTS: ALLOWED_MIME_TYPES.DOCUMENTS,
    JSON: ALLOWED_MIME_TYPES.JSON,
} as const;

/**
 * Common max sizes for validation
 */
export const FILE_SIZE_LIMITS = {
    IMAGE: MAX_FILE_SIZES.IMAGE,
    DOCUMENT: MAX_FILE_SIZES.DOCUMENT,
    VIDEO: MAX_FILE_SIZES.VIDEO,
    DATA: MAX_FILE_SIZES.DATA,
} as const;
