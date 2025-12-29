export const APP_NAME = "template-internal";
export const APP_PATH = "/api/auth";

export const ROLE_ENUM = {
    SYSTEM: "system",
    SUPERADMIN: "superadmin",
    ADMIN: "admin",
} as const;

export const LIST_ROLES = Object.values(ROLE_ENUM);
export const DEFAULT_CREATED_ROLE = ROLE_ENUM.ADMIN;
