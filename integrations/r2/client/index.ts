"use client";

import type {
    ClientUploadOptions,
    ClientUploadResult,
    UploadProgressCallback,
} from "../types";

/**
 * Upload a file to R2 using a presigned URL
 *
 * This function handles client-side uploads to R2 using presigned URLs.
 * It supports progress tracking and cancellation via AbortSignal.
 *
 * @example
 * ```tsx
 * import { uploadToPresignedUrl } from "@/integrations/r2/client";
 *
 * // Get presigned URL from server
 * const { url, key } = await getPresignedUrl({ ... });
 *
 * // Upload file with progress tracking
 * const result = await uploadToPresignedUrl({
 *     url,
 *     file: selectedFile,
 *     contentType: selectedFile.type,
 *     onProgress: ({ percentage }) => {
 *         console.log(`Upload progress: ${percentage}%`);
 *     },
 * });
 *
 * if (result.success) {
 *     console.log(`Uploaded to: ${result.key}`);
 * }
 * ```
 */
export async function uploadToPresignedUrl(
    options: ClientUploadOptions
): Promise<ClientUploadResult> {
    const { url, file, contentType, onProgress, signal } = options;

    // Extract key from URL (the path after the bucket name)
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    // Remove empty first element and bucket name
    const key = pathParts.slice(2).join("/");

    try {
        // Use XMLHttpRequest for progress tracking
        if (onProgress) {
            return await uploadWithProgress(
                url,
                file,
                contentType,
                onProgress,
                signal,
                key
            );
        }

        // Use fetch for simple uploads (no progress tracking)
        const response = await fetch(url, {
            method: "PUT",
            body: file,
            headers: contentType ? { "Content-Type": contentType } : undefined,
            signal,
        });

        if (!response.ok) {
            throw new Error(`Upload failed with status: ${response.status}`);
        }

        const etag = response.headers.get("ETag") ?? undefined;

        return {
            success: true,
            key,
            etag,
        };
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            return {
                success: false,
                key,
            };
        }
        throw error;
    }
}

/**
 * Upload with XMLHttpRequest for progress tracking
 */
function uploadWithProgress(
    url: string,
    file: File | Blob,
    contentType: string | undefined,
    onProgress: UploadProgressCallback,
    signal: AbortSignal | undefined,
    key: string
): Promise<ClientUploadResult> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Handle abort signal
        if (signal) {
            signal.addEventListener("abort", () => {
                xhr.abort();
            });
        }

        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                onProgress({
                    loaded: event.loaded,
                    total: event.total,
                    percentage: Math.round((event.loaded / event.total) * 100),
                });
            }
        });

        xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                const etag = xhr.getResponseHeader("ETag") ?? undefined;
                resolve({
                    success: true,
                    key,
                    etag,
                });
            } else {
                reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
        });

        xhr.addEventListener("error", () => {
            reject(new Error("Upload failed due to network error"));
        });

        xhr.addEventListener("abort", () => {
            resolve({
                success: false,
                key,
            });
        });

        xhr.open("PUT", url);

        if (contentType) {
            xhr.setRequestHeader("Content-Type", contentType);
        }

        xhr.send(file);
    });
}

/**
 * Generate a unique filename with timestamp
 *
 * @example
 * ```ts
 * const filename = generateUniqueFilename("avatar.jpg");
 * // Returns: "1705123456789-avatar.jpg"
 * ```
 */
export function generateUniqueFilename(originalFilename: string): string {
    const timestamp = Date.now();
    return `${timestamp}-${originalFilename}`;
}

/**
 * Generate a unique filename with UUID prefix
 *
 * @example
 * ```ts
 * const filename = generateUuidFilename("avatar.jpg");
 * // Returns: "a1b2c3d4-e5f6-7890-abcd-ef1234567890-avatar.jpg"
 * ```
 */
export function generateUuidFilename(originalFilename: string): string {
    const uuid = crypto.randomUUID();
    return `${uuid}-${originalFilename}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.slice(lastDot + 1).toLowerCase() : "";
}

/**
 * Validate file type against allowed MIME types
 *
 * @example
 * ```ts
 * const isValid = validateFileType(file, ["image/jpeg", "image/png"]);
 * ```
 */
export function validateFileType(
    file: File,
    allowedTypes: readonly string[]
): boolean {
    return allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
            // Wildcard type like "image/*"
            const prefix = type.slice(0, -1);
            return file.type.startsWith(prefix);
        }
        return file.type === type;
    });
}

/**
 * Validate file size against maximum allowed size
 *
 * @example
 * ```ts
 * const isValid = validateFileSize(file, 5 * 1024 * 1024); // 5MB
 * ```
 */
export function validateFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
}

/**
 * Format bytes to human-readable string
 *
 * @example
 * ```ts
 * formatBytes(1024); // "1 KB"
 * formatBytes(1536); // "1.5 KB"
 * formatBytes(1048576); // "1 MB"
 * ```
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
