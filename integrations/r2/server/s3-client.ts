import "server-only";

import type {
    PresignedUrlOptions,
    PresignedUrlResult,
    R2PresignedUrlGenerator,
} from "../types";

import { AwsClient } from "aws4fetch";

import {
    DEFAULT_PRESIGNED_URL_EXPIRY,
    MAX_PRESIGNED_URL_EXPIRY,
    MIN_PRESIGNED_URL_EXPIRY,
} from "../constants";

/**
 * S3-compatible client configuration
 */
interface S3ClientConfig {
    /**
     * Cloudflare Account ID
     */
    accountId: string;

    /**
     * R2 Access Key ID (from R2 API tokens)
     */
    accessKeyId: string;

    /**
     * R2 Secret Access Key (from R2 API tokens)
     */
    secretAccessKey: string;

    /**
     * Bucket name
     */
    bucketName: string;
}

/**
 * Get S3 client configuration from environment
 */
function getS3Config(): S3ClientConfig {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!accountId) {
        throw new Error("CLOUDFLARE_ACCOUNT_ID is required for R2 S3 client");
    }
    if (!accessKeyId) {
        throw new Error("R2_ACCESS_KEY_ID is required for R2 S3 client");
    }
    if (!secretAccessKey) {
        throw new Error("R2_SECRET_ACCESS_KEY is required for R2 S3 client");
    }
    if (!bucketName) {
        throw new Error("R2_BUCKET_NAME is required for R2 S3 client");
    }

    return {
        accountId,
        accessKeyId,
        secretAccessKey,
        bucketName,
    };
}

/**
 * Create an AWS4 client for R2 S3-compatible API
 */
function createAwsClient(config: S3ClientConfig): AwsClient {
    return new AwsClient({
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
        service: "s3",
        region: "auto",
    });
}

/**
 * Get the R2 S3-compatible endpoint URL
 */
function getR2Endpoint(accountId: string): string {
    return `https://${accountId}.r2.cloudflarestorage.com`;
}

/**
 * Build the full URL for an object
 */
function buildObjectUrl(
    endpoint: string,
    bucketName: string,
    key: string
): string {
    // Ensure key doesn't start with /
    const cleanKey = key.startsWith("/") ? key.slice(1) : key;
    return `${endpoint}/${bucketName}/${cleanKey}`;
}

/**
 * Validate and clamp expiry time
 */
function validateExpiry(expiresIn?: number): number {
    const expiry = expiresIn ?? DEFAULT_PRESIGNED_URL_EXPIRY;
    return Math.max(
        MIN_PRESIGNED_URL_EXPIRY,
        Math.min(MAX_PRESIGNED_URL_EXPIRY, expiry)
    );
}

/**
 * S3-compatible presigned URL generator using aws4fetch
 *
 * This implementation uses Cloudflare R2's S3-compatible API
 * to generate presigned URLs for client-side uploads/downloads.
 */
class S3PresignedUrlGenerator implements R2PresignedUrlGenerator {
    private client: AwsClient;
    private endpoint: string;
    private bucketName: string;

    constructor(config: S3ClientConfig) {
        this.client = createAwsClient(config);
        this.endpoint = getR2Endpoint(config.accountId);
        this.bucketName = config.bucketName;
    }

    async generateUploadUrl(
        options: PresignedUrlOptions
    ): Promise<PresignedUrlResult> {
        const expiresIn = validateExpiry(options.expiresIn);
        const url = buildObjectUrl(this.endpoint, this.bucketName, options.key);

        // Build headers for the presigned request
        const headers: Record<string, string> = {};
        if (options.contentType) {
            headers["Content-Type"] = options.contentType;
        }

        // Sign the request
        const signedRequest = await this.client.sign(
            new Request(url, {
                method: "PUT",
                headers,
            }),
            {
                aws: {
                    signQuery: true,
                    // @ts-expect-error - aws4fetch supports expiresIn but types may not reflect it
                    expiresIn,
                },
            }
        );

        return {
            url: signedRequest.url,
            key: options.key,
            expiresAt: Date.now() + expiresIn * 1000,
        };
    }

    async generateDownloadUrl(
        options: PresignedUrlOptions
    ): Promise<PresignedUrlResult> {
        const expiresIn = validateExpiry(options.expiresIn);
        const url = buildObjectUrl(this.endpoint, this.bucketName, options.key);

        const signedRequest = await this.client.sign(
            new Request(url, {
                method: "GET",
            }),
            {
                aws: {
                    signQuery: true,
                    // @ts-expect-error - aws4fetch supports expiresIn but types may not reflect it
                    expiresIn,
                },
            }
        );

        return {
            url: signedRequest.url,
            key: options.key,
            expiresAt: Date.now() + expiresIn * 1000,
        };
    }

    async generateDeleteUrl(
        options: PresignedUrlOptions
    ): Promise<PresignedUrlResult> {
        const expiresIn = validateExpiry(options.expiresIn);
        const url = buildObjectUrl(this.endpoint, this.bucketName, options.key);

        const signedRequest = await this.client.sign(
            new Request(url, {
                method: "DELETE",
            }),
            {
                aws: {
                    signQuery: true,
                    // @ts-expect-error - aws4fetch supports expiresIn but types may not reflect it
                    expiresIn,
                },
            }
        );

        return {
            url: signedRequest.url,
            key: options.key,
            expiresAt: Date.now() + expiresIn * 1000,
        };
    }
}

/**
 * Singleton instance
 */
let s3Client: S3PresignedUrlGenerator | null = null;

/**
 * Get the S3-compatible presigned URL generator
 *
 * This is a singleton that uses environment variables for configuration.
 * Uses aws4fetch under the hood for S3-compatible request signing.
 *
 * @example
 * ```ts
 * const generator = getS3PresignedUrlGenerator();
 * const { url, key, expiresAt } = await generator.generateUploadUrl({
 *     key: "uploads/users/123/avatar.jpg",
 *     contentType: "image/jpeg",
 *     expiresIn: 3600,
 * });
 * ```
 */
export function getS3PresignedUrlGenerator(): R2PresignedUrlGenerator {
    s3Client ??= new S3PresignedUrlGenerator(getS3Config());
    return s3Client;
}

/**
 * Reset the singleton (useful for testing)
 */
export function resetS3Client(): void {
    s3Client = null;
}
