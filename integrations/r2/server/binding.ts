import "server-only";

import type { R2TextOptions, R2TextStorage } from "../types";

/**
 * R2 Binding-based text storage implementation
 *
 * Uses the direct R2 binding (INTERNAL_BUCKET) for server-side operations.
 * This is more efficient than S3 API for server-to-R2 communication.
 */
class R2BindingStorage implements R2TextStorage {
    private bucket: R2Bucket;

    constructor(bucket: R2Bucket) {
        this.bucket = bucket;
    }

    async setText(
        key: string,
        value: string,
        options?: R2TextOptions
    ): Promise<void> {
        const httpMetadata: R2HTTPMetadata = {
            contentType: options?.contentType ?? "text/plain; charset=utf-8",
        };

        await this.bucket.put(key, value, {
            httpMetadata,
            customMetadata: options?.metadata,
        });
    }

    async getText(key: string): Promise<string | null> {
        const object = await this.bucket.get(key);
        if (!object) {
            return null;
        }
        return object.text();
    }

    async setJson<T>(
        key: string,
        value: T,
        options?: R2TextOptions
    ): Promise<void> {
        const jsonString = JSON.stringify(value);
        const httpMetadata: R2HTTPMetadata = {
            contentType:
                options?.contentType ?? "application/json; charset=utf-8",
        };

        await this.bucket.put(key, jsonString, {
            httpMetadata,
            customMetadata: options?.metadata,
        });
    }

    async getJson<T>(key: string): Promise<T | null> {
        const object = await this.bucket.get(key);
        if (!object) {
            return null;
        }
        const text = await object.text();
        try {
            return JSON.parse(text) as T;
        } catch {
            throw new Error(`Failed to parse JSON from key: ${key}`);
        }
    }

    async delete(key: string): Promise<void> {
        await this.bucket.delete(key);
    }

    async exists(key: string): Promise<boolean> {
        const head = await this.bucket.head(key);
        return head !== null;
    }

    async list(prefix?: string, limit?: number): Promise<string[]> {
        const options: R2ListOptions = {};
        if (prefix) {
            options.prefix = prefix;
        }
        if (limit) {
            options.limit = limit;
        }

        const result = await this.bucket.list(options);
        return result.objects.map((obj) => obj.key);
    }

    /**
     * Get raw R2Object with full metadata
     */
    async getRaw(key: string): Promise<R2ObjectBody | null> {
        return this.bucket.get(key);
    }

    /**
     * Get object metadata without body
     */
    async head(key: string): Promise<R2Object | null> {
        return this.bucket.head(key);
    }
}

/**
 * Singleton storage instance per environment
 */
let storage: R2BindingStorage | null = null;

/**
 * Get R2 text storage client using direct binding
 *
 * Uses the R2 binding for efficient server-side operations.
 * This is preferred over S3 API for server-side text/JSON storage.
 *
 * @param env - Cloudflare environment with INTERNAL_BUCKET binding
 *
 * @example
 * ```ts
 * import { getCFContext } from "@/integrations/cloudflare-context/server";
 * import { getR2Storage } from "@/integrations/r2/server";
 *
 * const { env } = await getCFContext();
 * const storage = getR2Storage(env);
 *
 * // Store JSON
 * await storage.setJson("config/settings.json", { theme: "dark" });
 *
 * // Retrieve JSON
 * const settings = await storage.getJson<{ theme: string }>("config/settings.json");
 *
 * // Store text
 * await storage.setText("data/notes.txt", "Hello, World!");
 *
 * // Retrieve text
 * const notes = await storage.getText("data/notes.txt");
 * ```
 */
export function getR2Storage(env: CloudflareEnv): R2TextStorage {
    if (!storage) {
        if (!env.INTERNAL_BUCKET) {
            throw new Error("INTERNAL_BUCKET R2 binding is not available");
        }
        storage = new R2BindingStorage(env.INTERNAL_BUCKET);
    }
    return storage;
}

/**
 * Get R2 binding storage with extended methods
 *
 * Returns the full implementation with additional methods like getRaw and head.
 */
export function getR2BindingStorage(env: CloudflareEnv): R2BindingStorage {
    if (!storage) {
        if (!env.INTERNAL_BUCKET) {
            throw new Error("INTERNAL_BUCKET R2 binding is not available");
        }
        storage = new R2BindingStorage(env.INTERNAL_BUCKET);
    }
    return storage;
}

/**
 * Reset the singleton (useful for testing)
 */
export function resetR2Storage(): void {
    storage = null;
}
