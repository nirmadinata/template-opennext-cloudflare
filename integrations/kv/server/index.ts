import { SecondaryStorage } from "better-auth";
import "server-only";

function createKV(env: CloudflareEnv): SecondaryStorage {
    const kv = env.MAIN_KV;
    return {
        delete: kv.delete,
        get: kv.get,
        set: (k, v, ttl) =>
            kv.put(k, v, ttl ? { expirationTtl: ttl } : undefined),
    };
}

let kv: SecondaryStorage | null = null;

export function getKV(env: CloudflareEnv) {
    kv ??= createKV(env);
    return kv;
}
