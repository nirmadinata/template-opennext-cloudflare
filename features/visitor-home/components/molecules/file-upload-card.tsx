"use client";

import { useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUploadWithProgress } from "@/hooks";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZES } from "@/integrations/r2";
import {
    validateFileType,
    validateFileSize,
    formatBytes,
} from "@/integrations/r2/client";

/**
 * FileUploadCard
 *
 * A molecule component that demonstrates client-side file upload to R2.
 * Uses the `useUploadWithProgress` hook for presigned URL uploads with progress tracking.
 */
export function FileUploadCard() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const {
        upload,
        cancel,
        reset,
        isUploading,
        progress,
        uploadedKey,
        error: uploadError,
    } = useUploadWithProgress({
        path: "uploads/demo",
        onSuccess: () => {
            setSelectedFile(null);
        },
    });

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            setValidationError(null);
            reset();

            if (!file) {
                setSelectedFile(null);
                return;
            }

            // Validate file type
            if (!validateFileType(file, ALLOWED_MIME_TYPES.IMAGES)) {
                setValidationError(
                    "Only image files are allowed (JPEG, PNG, GIF, WebP, SVG)"
                );
                return;
            }

            // Validate file size
            if (!validateFileSize(file, MAX_FILE_SIZES.IMAGE)) {
                setValidationError(
                    `File size must be less than ${formatBytes(MAX_FILE_SIZES.IMAGE)}`
                );
                return;
            }

            setSelectedFile(file);
        },
        [reset]
    );

    const handleUpload = useCallback(async () => {
        if (!selectedFile) return;
        setValidationError(null);
        await upload(selectedFile);
    }, [selectedFile, upload]);

    const error = validationError || uploadError;

    return (
        <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">File Upload Demo</h3>
            <p className="text-muted-foreground mb-4 text-sm">
                Upload an image file to R2 storage using presigned URLs.
            </p>

            <div className="space-y-4">
                <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />

                {selectedFile && (
                    <div className="text-muted-foreground text-sm">
                        Selected: {selectedFile.name} (
                        {formatBytes(selectedFile.size)})
                    </div>
                )}

                {error && (
                    <div className="text-destructive text-sm">{error}</div>
                )}

                {isUploading && (
                    <div className="space-y-2">
                        <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                            <div
                                className="bg-primary h-full transition-all duration-300"
                                style={{ width: `${progress.percentage}%` }}
                            />
                        </div>
                        <div className="text-muted-foreground flex items-center justify-between text-sm">
                            <span>{progress.percentage}% uploaded</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={cancel}
                                className="h-auto px-2 py-1 text-xs"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {uploadedKey && (
                    <div className="rounded bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        ✓ Uploaded successfully to: {uploadedKey}
                    </div>
                )}

                <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="w-full"
                >
                    {isUploading ? "Uploading..." : "Upload File"}
                </Button>
            </div>
        </div>
    );
}
