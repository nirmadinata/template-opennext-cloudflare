/**
 * R2 Storage Constants
 *
 * Centralized constants for R2 bucket paths and keys.
 * Use these constants to ensure consistent path naming across the application.
 */

/**
 * Default presigned URL expiration time in seconds (1 hour)
 */
export const DEFAULT_PRESIGNED_URL_EXPIRY = 3600;

/**
 * Minimum presigned URL expiration time in seconds (1 minute)
 */
export const MIN_PRESIGNED_URL_EXPIRY = 60;

/**
 * Maximum presigned URL expiration time in seconds (7 days)
 */
export const MAX_PRESIGNED_URL_EXPIRY = 604800;

/**
 * R2 bucket path prefixes
 *
 * Use these to organize files in the bucket.
 * All paths should NOT have trailing slashes.
 */
export const R2_PATHS = {
    /**
     * User uploaded files (avatars, documents, etc.)
     */
    UPLOADS: "uploads",

    /**
     * User-specific uploads: uploads/users/{userId}
     */
    USER_UPLOADS: "uploads/users",

    /**
     * Public assets that can be cached
     */
    PUBLIC: "public",

    /**
     * Temporary files (auto-cleanup recommended)
     */
    TEMP: "temp",

    /**
     * Application data stored as JSON/text
     */
    DATA: "data",

    /**
     * Configuration files
     */
    CONFIG: "config",

    /**
     * Media files (images, videos, audio)
     */
    MEDIA: "media",

    /**
     * Media images: media/images
     */
    MEDIA_IMAGES: "media/images",

    /**
     * Media videos: media/videos
     */
    MEDIA_VIDEOS: "media/videos",
} as const;

/**
 * Allowed MIME types for uploads
 */
export const ALLOWED_MIME_TYPES = {
    IMAGES: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/svg+xml",
    ],
    DOCUMENTS: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
    ],
    JSON: ["application/json"],
    ALL_IMAGES: ["image/*"],
} as const;

/**
 * Maximum file sizes in bytes
 */
export const MAX_FILE_SIZES = {
    /**
     * 5MB for images
     */
    IMAGE: 5 * 1024 * 1024,

    /**
     * 10MB for documents
     */
    DOCUMENT: 10 * 1024 * 1024,

    /**
     * 100MB for videos
     */
    VIDEO: 100 * 1024 * 1024,

    /**
     * 1MB for JSON/text data
     */
    DATA: 1 * 1024 * 1024,
} as const;

/**
 * Helper to build a full R2 key/path
 *
 * @example
 * buildR2Key(R2_PATHS.USER_UPLOADS, userId, 'avatar.jpg')
 * // Returns: "uploads/users/{userId}/avatar.jpg"
 */
export function buildR2Key(...segments: string[]): string {
    return segments.filter(Boolean).join("/");
}
