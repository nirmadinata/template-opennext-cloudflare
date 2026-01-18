/**
 * table names
 */
export const TABLE_ALIASES = {
    /**
     * master tables
     */
    USERS: "users",
    SESSIONS: "sessions",
    ACCOUNTS: "accounts",
    VERIFICATIONS: "verifications",

    /**
     * page setting related
     */
    LOCALES: "locales",
    TAGS: "tags",
    STATIC_PAGE_DATA: "static_page_data",

    /**
     * media related
     */
    MIME_TYPES: "mime_types",
    MEDIAS: "media",
    MEDIA_TAGS: "media_tags",
} as const;

export const COLUMN_ALIASES = {
    /**
     * common columns
     */
    COMMON_COLUMNS: {
        ID: "id",
        CREATED_AT: "created_at",
        UPDATED_AT: "updated_at",
        CREATED_BY: "created_by",
        UPDATED_BY: "updated_by",
    },

    USERS: {
        NAME: "name",
        EMAIL: "email",
        EMAIL_VERIFIED: "email_verified",
        IMAGE: "image",
        ROLE: "role",
        BANNED: "banned",
        BAN_REASON: "ban_reason",
        BAN_EXPIRES: "ban_expires",
    },
    ACCOUNTS: {
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
    },
    SESSIONS: {
        USER_ID: "user_id",
        TOKEN: "token",
        EXPIRES_AT: "expires_at",
        IP_ADDRESS: "ip_address",
        USER_AGENT: "user_agent",
        IMPERSONATED_BY: "impersonated_by",
    },
    VERIFICATIONS: {
        IDENTIFIER: "identifier",
        VALUE: "value",
        EXPIRES_AT: "expires_at",
    },
} as const;

export const INDEXES_ENUM = {
    USERS_EMAIL: "idx_users_email",
    SESSION_USER_ID: "idx_sessions_user_id",
    SESSION_TOKEN: "idx_sessions_token",
    ACCOUNTS_USER_ID: "idx_accounts_user_id",
    VERIFICATIONS_IDENTIFIER: "idx_verifications_identifier",
    TAGS_NAME: "idx_tags_name",
    TAGS_SLUG: "idx_tags_slug",
    LOCALES_CODE: "idx_locales_code",
    LOCALES_NAME: "idx_locales_name",
    MEDIA_NAME: "idx_media_name",
    MIME_TYPES_MIME_TYPE: "idx_mime_types_mime_type",
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

export const STATIC_PAGE_DATA_COLUMN_ENUM = {
    SLUG: "slug",

    /**
     * meta fields
     */
    META_TITLE: "meta_title",
    META_DESCRIPTION: "meta_description",
    META_KEYWORDS: "meta_keywords",
    META_IMAGE_MEDIA_ID: "meta_image_media_id",

    /**
     * sitemap fields
     */
    SITEMAP_CHANGE_FREQUENCY: "sitemap_change_frequency",
    SITEMAP_PRIORITY: "sitemap_priority",
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
