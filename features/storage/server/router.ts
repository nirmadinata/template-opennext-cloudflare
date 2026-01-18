import {
    generateDeleteUrl,
    generateDownloadUrl,
    generateUploadUrl,
} from "./procedures";

/**
 * Storage Router
 *
 * Handles R2 storage operations via RPC.
 * All procedures generate presigned URLs for client-side operations.
 */
export const storageRouter = {
    generateUploadUrl,
    generateDownloadUrl,
    generateDeleteUrl,
};

export type StorageRouter = typeof storageRouter;
