"use client";

import { useState, useCallback, useRef } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { R2_PATHS } from "@/integrations/r2";
import {
    uploadToPresignedUrl,
    generateUniqueFilename,
} from "@/integrations/r2/client";
import { orpc } from "@/integrations/rpc/client";

/**
 * Progress information during upload
 */
export interface UploadProgress {
    /** Bytes loaded so far */
    loaded: number;
    /** Total bytes to upload */
    total: number;
    /** Percentage complete (0-100) */
    percentage: number;
}

/**
 * Upload state for the progress-tracking upload hook
 */
export interface UploadWithProgressState {
    /** Whether an upload is in progress */
    isUploading: boolean;
    /** Current upload progress */
    progress: UploadProgress;
    /** The key of the last successfully uploaded file */
    uploadedKey: string | null;
    /** Any error that occurred during upload */
    error: string | null;
}

/**
 * Options for the useUploadWithProgress hook
 */
export interface UseUploadWithProgressOptions {
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
     * Callback when upload progress changes
     */
    onProgress?: (progress: UploadProgress) => void;
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
 * Return type for the useUploadWithProgress hook
 */
export interface UseUploadWithProgressReturn extends UploadWithProgressState {
    /** Upload a file to R2 storage with progress tracking */
    upload: (file: File) => Promise<string | null>;
    /** Cancel the current upload */
    cancel: () => void;
    /** Reset the upload state */
    reset: () => void;
}

const initialProgress: UploadProgress = {
    loaded: 0,
    total: 0,
    percentage: 0,
};

/**
 * useUploadWithProgress - File upload hook with progress tracking
 *
 * A hook for uploading files to R2 storage using presigned URLs with
 * real-time progress tracking and cancellation support.
 *
 * @example
 * ```tsx
 * import { useUploadWithProgress } from "@/hooks";
 *
 * function MyComponent() {
 *     const {
 *         upload,
 *         cancel,
 *         reset,
 *         isUploading,
 *         progress,
 *         uploadedKey,
 *         error,
 *     } = useUploadWithProgress({
 *         path: "uploads/documents",
 *         onProgress: (p) => console.log(`${p.percentage}%`),
 *         onSuccess: (key) => console.log(`Uploaded: ${key}`),
 *     });
 *
 *     return (
 *         <div>
 *             <button onClick={() => upload(selectedFile)} disabled={isUploading}>
 *                 {isUploading ? `Uploading ${progress.percentage}%...` : "Upload"}
 *             </button>
 *             {isUploading && (
 *                 <button onClick={cancel}>Cancel</button>
 *             )}
 *             <div className="progress-bar" style={{ width: `${progress.percentage}%` }} />
 *         </div>
 *     );
 * }
 * ```
 */
export function useUploadWithProgress(
    options: UseUploadWithProgressOptions = {}
): UseUploadWithProgressReturn {
    const {
        path = R2_PATHS.UPLOADS,
        filename,
        expiresIn = 3600,
        onProgress,
        onSuccess,
        onError,
        invalidateKeys = ["storage"],
    } = options;

    const [progress, setProgress] = useState<UploadProgress>(initialProgress);
    const [uploadedKey, setUploadedKey] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);
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
                signal,
            }: {
                url: string;
                file: File;
                key: string;
                signal: AbortSignal;
            }) => {
                const result = await uploadToPresignedUrl({
                    url,
                    file,
                    contentType: file.type,
                    signal,
                    onProgress: (progressData) => {
                        const newProgress: UploadProgress = {
                            loaded: progressData.loaded,
                            total: progressData.total,
                            percentage: progressData.percentage,
                        };
                        setProgress(newProgress);
                        onProgress?.(newProgress);
                    },
                });

                if (!result.success) {
                    throw new Error("Upload failed or was cancelled");
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
                // Don't set error for cancelled uploads
                if (err.message !== "Upload failed or was cancelled") {
                    setError(err.message);
                    onError?.(err);
                }
            },
        }
    );

    const isUploading = isGeneratingUrl || isUploadingFile;

    /**
     * Upload a file to R2 storage with progress tracking
     * @param file The file to upload
     * @returns The key of the uploaded file, or null if failed/cancelled
     */
    const upload = useCallback(
        async (file: File): Promise<string | null> => {
            try {
                setError(null);
                setUploadedKey(null);
                setProgress(initialProgress);

                // Create new abort controller for this upload
                abortControllerRef.current = new AbortController();

                // Step 1: Get presigned URL
                const {
                    url,
                    key,
                    file: fileToUpload,
                } = await generateUploadUrl(file);

                // Step 2: Upload file with progress
                const result = await uploadFile({
                    url,
                    file: fileToUpload,
                    key,
                    signal: abortControllerRef.current.signal,
                });

                return result.key;
            } catch (err) {
                // Don't set error for cancelled uploads
                if (err instanceof Error && err.name === "AbortError") {
                    return null;
                }
                const errorMessage =
                    err instanceof Error ? err.message : "Upload failed";
                setError(errorMessage);
                return null;
            } finally {
                abortControllerRef.current = null;
            }
        },
        [generateUploadUrl, uploadFile]
    );

    /**
     * Cancel the current upload
     */
    const cancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            setProgress(initialProgress);
        }
    }, []);

    /**
     * Reset the upload state
     */
    const reset = useCallback(() => {
        setUploadedKey(null);
        setError(null);
        setProgress(initialProgress);
    }, []);

    return {
        upload,
        cancel,
        reset,
        isUploading,
        progress,
        uploadedKey,
        error,
    };
}
