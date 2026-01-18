import { relations, sql } from "drizzle-orm";
import {
    index,
    int,
    primaryKey,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";

import {
    COLUMN_ALIASES,
    INDEXES_ENUM,
    TABLE_ALIASES,
    USER_ROLE_DEFAULT,
    USER_ROLE_LIST,
} from "@/integrations/db/constants";

const CURRENT_TIMESTAMP = sql`CURRENT_TIMESTAMP`;

const COMMON_COLUMNS = {
    createdAt: int(COLUMN_ALIASES.COMMON_COLUMNS.CREATED_AT, {
        mode: "timestamp_ms",
    })
        .notNull()
        .default(CURRENT_TIMESTAMP),
    updatedAt: int(COLUMN_ALIASES.COMMON_COLUMNS.UPDATED_AT, {
        mode: "timestamp_ms",
    })
        .notNull()
        .default(CURRENT_TIMESTAMP)
        .$onUpdate(() => CURRENT_TIMESTAMP),
} as const;

const COMMON_AUTHORED_COLUMNS = {
    createdBy: text(COLUMN_ALIASES.COMMON_COLUMNS.CREATED_BY)
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
    updatedBy: text(COLUMN_ALIASES.COMMON_COLUMNS.UPDATED_BY)
        .notNull()
        .references(() => users.id, {
            onDelete: "cascade",
        }),
} as const;

/**
 * tables
 */
export const users = sqliteTable(
    TABLE_ALIASES.USERS,
    {
        ...COMMON_COLUMNS,

        id: text(COLUMN_ALIASES.COMMON_COLUMNS.ID),

        /**
         * user username
         */
        name: text(COLUMN_ALIASES.USERS.NAME).notNull(),

        /**
         * user email address
         */
        email: text(COLUMN_ALIASES.USERS.EMAIL).notNull().unique(),

        /**
         * is email verified
         */
        emailVerified: int(COLUMN_ALIASES.USERS.EMAIL_VERIFIED, {
            mode: "boolean",
        }).default(false),

        /**
         * user image URL
         */
        image: text(COLUMN_ALIASES.USERS.IMAGE),

        /**
         * related to admin plugins
         */

        role: text(COLUMN_ALIASES.USERS.ROLE, {
            enum: USER_ROLE_LIST,
        }).default(USER_ROLE_DEFAULT),

        banned: int(COLUMN_ALIASES.USERS.BANNED, {
            mode: "boolean",
        }).default(false),

        banReason: text(COLUMN_ALIASES.USERS.BAN_REASON),
        banExpires: int(COLUMN_ALIASES.USERS.BAN_EXPIRES, {
            mode: "timestamp_ms",
        }),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.USERS_EMAIL).on(table.email),
    ]
);
export const sessions = sqliteTable(
    TABLE_ALIASES.SESSIONS,
    {
        ...COMMON_COLUMNS,

        /**
         * primary key for the session table
         */
        id: text(COLUMN_ALIASES.COMMON_COLUMNS.ID),

        /**
         * references the user table (id)
         */
        userId: text(COLUMN_ALIASES.SESSIONS.USER_ID)
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        token: text(COLUMN_ALIASES.SESSIONS.TOKEN).notNull().unique(),
        expiresAt: int(COLUMN_ALIASES.SESSIONS.EXPIRES_AT, {
            mode: "timestamp_ms",
        }).notNull(),

        ipAddress: text(COLUMN_ALIASES.SESSIONS.IP_ADDRESS),
        userAgent: text(COLUMN_ALIASES.SESSIONS.USER_AGENT),
        impersonatedBy: text(COLUMN_ALIASES.SESSIONS.IMPERSONATED_BY),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.SESSION_USER_ID).on(table.userId),
        index(INDEXES_ENUM.SESSION_TOKEN).on(table.token),
    ]
);

export const accounts = sqliteTable(
    TABLE_ALIASES.ACCOUNTS,
    {
        ...COMMON_COLUMNS,

        /**
         * primary key for the account table
         */
        id: text(COLUMN_ALIASES.COMMON_COLUMNS.ID),

        /**
         * references the user table (id)
         */
        userId: text(COLUMN_ALIASES.ACCOUNTS.USER_ID)
            .notNull()
            .references(() => users.id, {
                onDelete: "cascade",
            }),

        accountId: text(COLUMN_ALIASES.ACCOUNTS.ACCOUNT_ID).notNull(),
        providerId: text(COLUMN_ALIASES.ACCOUNTS.PROVIDER_ID).notNull(),
        accessToken: text(COLUMN_ALIASES.ACCOUNTS.ACCESS_TOKEN),
        refreshToken: text(COLUMN_ALIASES.ACCOUNTS.REFRESH_TOKEN),
        accessTokenExpiresAt: int(
            COLUMN_ALIASES.ACCOUNTS.ACCESS_TOKEN_EXPIRES_AT,
            {
                mode: "timestamp_ms",
            }
        ),
        refreshTokenExpiresAt: int(
            COLUMN_ALIASES.ACCOUNTS.REFRESH_TOKEN_EXPIRES_AT,
            {
                mode: "timestamp_ms",
            }
        ),
        scope: text(COLUMN_ALIASES.ACCOUNTS.SCOPE),
        idToken: text(COLUMN_ALIASES.ACCOUNTS.ID_TOKEN),
        password: text(COLUMN_ALIASES.ACCOUNTS.PASSWORD),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.ACCOUNTS_USER_ID).on(table.userId),
    ]
);
export const verifications = sqliteTable(
    TABLE_ALIASES.VERIFICATIONS,
    {
        ...COMMON_COLUMNS,

        /**
         * primary key for the verification table
         */
        id: text(COLUMN_ALIASES.COMMON_COLUMNS.ID),

        identifier: text(COLUMN_ALIASES.VERIFICATIONS.IDENTIFIER).notNull(),
        value: text(COLUMN_ALIASES.VERIFICATIONS.VALUE).notNull(),
        expiresAt: int(COLUMN_ALIASES.VERIFICATIONS.EXPIRES_AT, {
            mode: "timestamp_ms",
        }).notNull(),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.VERIFICATIONS_IDENTIFIER).on(table.identifier),
    ]
);

export const tags = sqliteTable(
    TABLE_ALIASES.TAGS,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),
        name: text("name", {
            length: 100,
        })
            .notNull()
            .unique(),
        slug: text("slug").notNull().unique(),
    },
    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.TAGS_NAME).on(table.name),
        index(INDEXES_ENUM.TAGS_SLUG).on(table.slug),
    ]
);

export const locales = sqliteTable(
    TABLE_ALIASES.LOCALES,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),
        code: text("code", {
            length: 5,
        })
            .notNull()
            .unique(),
        name: text("name", {
            length: 50,
        })
            .notNull()
            .unique(),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.LOCALES_CODE).on(table.code),
        index(INDEXES_ENUM.LOCALES_NAME).on(table.name),
    ]
);

export const mimeTypes = sqliteTable(
    TABLE_ALIASES.MIME_TYPES,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),
        mimeType: text("mime_type").notNull().unique(),
        title: text("title").notNull(),
        description: text("description"),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.MIME_TYPES_MIME_TYPE).on(table.mimeType),
    ]
);

export const medias = sqliteTable(
    TABLE_ALIASES.MEDIAS,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),

        /**
         * foreign keys
         */
        mediaMimeTypeId: int("media_mime_type_id")
            .notNull()
            .references(() => mimeTypes.id, {
                onDelete: "cascade",
            }),

        /**
         * general fields
         */
        name: text("name").notNull(),
        description: text("description"),
        storageKey: text("storage_key").notNull().unique(),
        sizeInBytes: int("size_in_bytes").notNull(),

        /**
         * image-kind specific fields
         */
        imageWidth: int("image_width"),
        imageHeight: int("image_height"),
        imageAltText: text("image_alt_text"),

        /**
         * playable-kind specific fields
         */
        duration: int("duration"),
    } as const,
    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.MEDIA_NAME).on(table.name),
    ]
);

export const mediaTags = sqliteTable(
    TABLE_ALIASES.MEDIA_TAGS,
    {
        ...COMMON_COLUMNS,

        id: int(COLUMN_ALIASES.COMMON_COLUMNS.ID),
        mediaId: int("media_id")
            .notNull()
            .references(() => medias.id, {
                onDelete: "cascade",
            }),
        tagId: int("tag_id")
            .notNull()
            .references(() => tags.id, {
                onDelete: "cascade",
            }),
    },
    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table.id],
        }),

        /**
         * indexes
         */
    ]
);

/**
 * relations
 */
export const userRelations = relations(users, ({ many }) => ({
    sessions: many(sessions),
    accounts: many(accounts),
}));

export const sessionRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts.userId],
        references: [users.id],
    }),
}));

export const verificationRelations = relations(verifications, (_) => ({}));

export const mediaMimeTypeRelations = relations(mimeTypes, ({ many }) => ({
    medias: many(medias),
}));

export const mediaRelations = relations(medias, ({ one, many }) => ({
    mediaMimeType: one(mimeTypes, {
        fields: [medias.mediaMimeTypeId],
        references: [mimeTypes.id],
    }),
    mediaTags: many(mediaTags),
}));

export const localeRelations = relations(locales, (_) => ({}));

export const tagRelations = relations(tags, ({ many }) => ({
    mediaTags: many(mediaTags),
}));

export const mediaTagRelations = relations(mediaTags, ({ one }) => ({
    media: one(medias, {
        fields: [mediaTags.mediaId],
        references: [medias.id],
    }),
    tag: one(tags, {
        fields: [mediaTags.tagId],
        references: [tags.id],
    }),
}));
