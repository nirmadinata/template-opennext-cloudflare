/**
 * table names
 */
export const TABLE_ENUM = {
    /**
     * better-auth specific tables
     */
    USERS: "users",
    SESSIONS: "sessions",
    ACCOUNTS: "accounts",
    VERIFICATIONS: "verifications",

    /**
     * page settings specific tables
     */
    LOCALES: "locales",
    TAGS: "tags",

    /**
     * media specific tables
     */
    MEDIAS: "media",
    MEDIA_MIME_TYPES: "media_mime_types",
} as const;

/**
 * common column names
 */
export const COMMON_COLUMN_ENUM = {
    ID: "id",
    CREATED_AT: "created_at",
    UPDATED_AT: "updated_at",
} as const;

export const COMMON_AUTHORED_COLUMN_ENUM = {
    CREATED_BY: "created_by",
    UPDATED_BY: "updated_by",
} as const;

/**
 * actual column names for each table
 */

export const USER_COLUMN_ENUM = {
    NAME: "name",
    EMAIL: "email",
    EMAIL_VERIFIED: "email_verified",
    IMAGE: "image",
    ROLE: "role",
    BANNED: "banned",
    BAN_REASON: "ban_reason",
    BAN_EXPIRES: "ban_expires",
} as const;

export const SESSION_COLUMN_ENUM = {
    USER_ID: "user_id",
    TOKEN: "token",
    EXPIRES_AT: "expires_at",
    IP_ADDRESS: "ip_address",
    USER_AGENT: "user_agent",
    IMPERSONATED_BY: "impersonated_by",
} as const;

export const ACCOUNT_COLUMN_ENUM = {
    USER_ID: "user_id",
    ACCOUNT_ID: "account_id",
    PROVIDER_ID: "provider_id",
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    ACCESS_TOKEN_EXPIRES_AT: "access_token_expires_at",
    REFRESH_TOKEN_EXPIRES_AT: "refresh_token_expires_at",
    SCOPE: "scope",
    ID_TOKEN: "id_token",
    PASSWORD: "password",
} as const;

export const VERIFICATION_COLUMN_ENUM = {
    IDENTIFIER: "identifier",
    VALUE: "value",
    EXPIRES_AT: "expires_at",
} as const;

export const TAGS_COLUMN_ENUM = {
    NAME: "name",
    SLUG: "slug",
} as const;

export const LOCALE_COLUMN_ENUM = {
    CODE: "code",
    NAME: "name",
    IS_RTL: "is_rtl",
    FLAG_IMAGE_KEY: "flag_image_key",
    ENABLED: "enabled",
} as const;

export const MEDIA_COLUMN_ENUM = {
    /**
     * foreign keys
     */
    MEDIA_MIME_TYPE_ID: "media_mime_type_id",

    /**
     * general fields
     */
    NAME: "name",
    DESCRIPTION: "description",
    STORAGE_KEY: "storage_key",
    SIZE_IN_BYTES: "size_in_bytes",
    TAGS: "tags",

    /**
     * image-kind specific fields
     */
    IMAGE_WIDTH: "image_width",
    IMAGE_HEIGHT: "image_height",
    IMAGE_ALT_TEXT: "image_alt_text",

    /**
     * playable-kind specific fields
     */
    DURATION: "duration",
} as const;

export const MEDIA_MIME_TYPE_COLUMN_ENUM = {
    MIME_TYPE: "mime_type",
    TITLE: "title",
    DESCRIPTION: "description",
} as const;

export const MEDIA_TAGS_COLUMN_ENUM = {
    MEDIA_ID: "media_id",
    TAG_ID: "tag_id",
} as const;

/**
 * constants for schema definitions
 */
export const USER_ROLE_ENUM = {
    ADMIN: "admin",
    USER: "user",
} as const;
export const USER_ROLE_LIST = [
    USER_ROLE_ENUM.ADMIN,
    USER_ROLE_ENUM.USER,
] as const;
export const USER_ROLE_DEFAULT = USER_ROLE_ENUM.ADMIN;
