import "server-only";

export function getInternalKV(env: CloudflareEnv) {
    return env.INTERNAL_KV;
}
