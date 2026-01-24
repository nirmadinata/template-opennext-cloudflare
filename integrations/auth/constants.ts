export const APP_NAME = "template-internal";
export const APP_PATH = "/api/auth";

export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 64;

export const ROLE_ENUM = {
    SYSTEM: "system",
    SUPERADMIN: "superadmin",
    ADMIN: "admin",
} as const;

export const DEFAULT_CREATED_ROLE = ROLE_ENUM.ADMIN;
