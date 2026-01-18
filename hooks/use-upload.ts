"use client";

import { useState, useCallback } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { R2_PATHS } from "@/integrations/r2";
import {
    uploadToPresignedUrl,
    generateUniqueFilename,
} from "@/integrations/r2/client";
import { orpc } from "@/integrations/rpc/client";

/**
 * Upload state for the simple upload hook
 */
export interface UploadState {
    /** Whether an upload is in progress */
    isUploading: boolean;
    /** The key of the last successfully uploaded file */
    uploadedKey: string | null;
    /** Any error that occurred during upload */
    error: string | null;
}

/**
 * Options for the useUpload hook
 */
export interface UseUploadOptions {
    /**
     * R2 path for uploads (e.g., "uploads/photos", "documents/reports")
     * @default R2_PATHS.UPLOADS
     */
    path?: string;
    /**
     * Optional custom filename. If not provided, a unique filename will be generated.
     */
    filename?: string;
    /**
     * Presigned URL expiration in seconds
     * @default 3600 (1 hour)
     */
    expiresIn?: number;
    /**
     * Callback when upload succeeds
     */
    onSuccess?: (key: string) => void;
    /**
     * Callback when upload fails
     */
    onError?: (error: Error) => void;
    /**
     * Query keys to invalidate on success
     * @default ["storage"]
     */
    invalidateKeys?: string[];
}

/**
 * Return type for the useUpload hook
 */
export interface UseUploadReturn extends UploadState {
    /** Upload a file to R2 storage */
    upload: (file: File) => Promise<string | null>;
    /** Reset the upload state */
    reset: () => void;
}

/**
 * useUpload - Simple file upload hook without progress tracking
 *
 * A clean hook for uploading files to R2 storage using presigned URLs.
 * For uploads with progress tracking, use `useUploadWithProgress` instead.
 *
 * @example
 * ```tsx
 * import { useUpload } from "@/hooks";
 *
 * function MyComponent() {
 *     const { upload, isUploading, uploadedKey, error, reset } = useUpload({
 *         path: "uploads/avatars",
 *         onSuccess: (key) => console.log(`Uploaded: ${key}`),
 *     });
 *
 *     const handleUpload = async (file: File) => {
 *         const key = await upload(file);
 *         if (key) {
 *             // Handle success
 *         }
 *     };
 *
 *     return (
 *         <button onClick={() => handleUpload(selectedFile)} disabled={isUploading}>
 *             {isUploading ? "Uploading..." : "Upload"}
 *         </button>
 *     );
 * }
 * ```
 */
export function useUpload(options: UseUploadOptions = {}): UseUploadReturn {
    const {
        path = R2_PATHS.UPLOADS,
        filename,
        expiresIn = 3600,
        onSuccess,
        onError,
        invalidateKeys = ["storage"],
    } = options;

    const [uploadedKey, setUploadedKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const queryClient = useQueryClient();

    // Generate presigned URL mutation
    const { mutateAsync: generateUploadUrl, isPending: isGeneratingUrl } =
        useMutation({
            mutationFn: async (file: File) => {
                const finalFilename =
                    filename ?? generateUniqueFilename(file.name);
                const key = `${path}/${finalFilename}`;

                const result = await orpc.storage.generateUploadUrl.call({
                    key,
                    contentType: file.type,
                    contentLength: file.size,
                    expiresIn,
                });

                return { ...result, file };
            },
        });

    // Upload file mutation
    const { mutateAsync: uploadFile, isPending: isUploadingFile } = useMutation(
        {
            mutationFn: async ({
                url,
                file,
                key,
            }: {
                url: string;
                file: File;
                key: string;
            }) => {
                const result = await uploadToPresignedUrl({
                    url,
                    file,
                    contentType: file.type,
                });

                if (!result.success) {
                    throw new Error("Upload failed");
                }

                return { key };
            },
            onSuccess: (data) => {
                setUploadedKey(data.key);
                // Invalidate specified query keys
                invalidateKeys.forEach((key) => {
                    queryClient.invalidateQueries({ queryKey: [key] });
                });
                onSuccess?.(data.key);
            },
            onError: (err: Error) => {
                setError(err.message);
                onError?.(err);
            },
        }
    );

    const isUploading = isGeneratingUrl || isUploadingFile;

    /**
     * Upload a file to R2 storage
     * @param file The file to upload
     * @returns The key of the uploaded file, or null if failed
     */
    const upload = useCallback(
        async (file: File): Promise<string | null> => {
            try {
                setError(null);
                setUploadedKey(null);

                // Step 1: Get presigned URL
                const {
                    url,
                    key,
                    file: fileToUpload,
                } = await generateUploadUrl(file);

                // Step 2: Upload file
                const result = await uploadFile({
                    url,
                    file: fileToUpload,
                    key,
                });

                return result.key;
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "Upload failed";
                setError(errorMessage);
                return null;
            }
        },
        [generateUploadUrl, uploadFile]
    );

    /**
     * Reset the upload state
     */
    const reset = useCallback(() => {
        setUploadedKey(null);
        setError(null);
    }, []);

    return {
        upload,
        isUploading,
        uploadedKey,
        error,
        reset,
    };
}
