/**
 * R2 Storage Types
 *
 * Interfaces and types for R2 storage operations.
 * These abstractions allow the underlying implementation to be swapped.
 */

/**
 * Options for generating a presigned URL
 */
export interface PresignedUrlOptions {
    /**
     * The key/path of the object in the bucket
     */
    key: string;

    /**
     * Expiration time in seconds (default: 3600)
     */
    expiresIn?: number;

    /**
     * Content type for PUT operations
     */
    contentType?: string;

    /**
     * Content length for PUT operations (optional, for validation)
     */
    contentLength?: number;
}

/**
 * Result of presigned URL generation
 */
export interface PresignedUrlResult {
    /**
     * The presigned URL
     */
    url: string;

    /**
     * The key/path used
     */
    key: string;

    /**
     * Expiration timestamp (Unix ms)
     */
    expiresAt: number;
}

/**
 * Options for text/data operations
 */
export interface R2TextOptions {
    /**
     * Content type (default: "application/json" for objects, "text/plain" for strings)
     */
    contentType?: string;

    /**
     * Custom metadata
     */
    metadata?: Record<string, string>;
}

/**
 * Result of a GET operation
 */
export interface R2GetResult<T = unknown> {
    /**
     * The retrieved data
     */
    data: T;

    /**
     * Content type of the stored data
     */
    contentType: string;

    /**
     * Custom metadata
     */
    metadata: Record<string, string>;

    /**
     * ETag of the object
     */
    etag: string;

    /**
     * Last modified timestamp
     */
    lastModified: Date;
}

/**
 * Interface for R2 text/data operations
 *
 * This abstraction allows swapping the underlying implementation.
 */
export interface R2TextStorage {
    /**
     * Store text data at the specified key
     */
    setText(key: string, value: string, options?: R2TextOptions): Promise<void>;

    /**
     * Retrieve text data from the specified key
     */
    getText(key: string): Promise<string | null>;

    /**
     * Store JSON data at the specified key
     */
    setJson<T>(key: string, value: T, options?: R2TextOptions): Promise<void>;

    /**
     * Retrieve JSON data from the specified key
     */
    getJson<T>(key: string): Promise<T | null>;

    /**
     * Delete data at the specified key
     */
    delete(key: string): Promise<void>;

    /**
     * Check if a key exists
     */
    exists(key: string): Promise<boolean>;

    /**
     * List keys with an optional prefix
     */
    list(prefix?: string, limit?: number): Promise<string[]>;
}

/**
 * Interface for presigned URL generation
 *
 * This abstraction allows swapping the underlying implementation.
 */
export interface R2PresignedUrlGenerator {
    /**
     * Generate a presigned URL for uploading (PUT)
     */
    generateUploadUrl(
        options: PresignedUrlOptions
    ): Promise<PresignedUrlResult>;

    /**
     * Generate a presigned URL for downloading (GET)
     */
    generateDownloadUrl(
        options: PresignedUrlOptions
    ): Promise<PresignedUrlResult>;

    /**
     * Generate a presigned URL for deletion (DELETE)
     */
    generateDeleteUrl(
        options: PresignedUrlOptions
    ): Promise<PresignedUrlResult>;
}

/**
 * Combined R2 storage interface
 */
export interface R2StorageClient
    extends R2TextStorage, R2PresignedUrlGenerator {}

/**
 * Client-side upload progress callback
 */
export type UploadProgressCallback = (progress: {
    loaded: number;
    total: number;
    percentage: number;
}) => void;

/**
 * Client-side upload options
 */
export interface ClientUploadOptions {
    /**
     * The presigned URL to upload to
     */
    url: string;

    /**
     * The file to upload
     */
    file: File | Blob;

    /**
     * Content type (auto-detected from file if not provided)
     */
    contentType?: string;

    /**
     * Progress callback
     */
    onProgress?: UploadProgressCallback;

    /**
     * Abort signal for cancellation
     */
    signal?: AbortSignal;
}

/**
 * Client-side upload result
 */
export interface ClientUploadResult {
    /**
     * Whether the upload was successful
     */
    success: boolean;

    /**
     * The key/path of the uploaded file
     */
    key: string;

    /**
     * ETag returned by the server
     */
    etag?: string;
}
