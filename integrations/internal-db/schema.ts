import { relations, sql } from "drizzle-orm";
import {
    index,
    int,
    primaryKey,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";

import {
    ACCOUNT_COLUMN_ENUM,
    COMMON_COLUMN_ENUM,
    INDEXES_ENUM,
    LOCALE_COLUMN_ENUM,
    MEDIA_COLUMN_ENUM,
    MEDIA_MIME_TYPE_COLUMN_ENUM,
    MEDIA_TAGS_COLUMN_ENUM,
    SESSION_COLUMN_ENUM,
    TABLE_ENUM,
    TAGS_COLUMN_ENUM,
    USER_COLUMN_ENUM,
    USER_ROLE_DEFAULT,
    USER_ROLE_LIST,
    VERIFICATION_COLUMN_ENUM,
} from "@/integrations/internal-db/constants";

const CURRENT_TIMESTAMP = sql`CURRENT_TIMESTAMP`;

const COMMON_COLUMNS = {
    created_at: int({
        mode: "timestamp",
    })
        .notNull()
        .default(CURRENT_TIMESTAMP),
    updated_at: int({
        mode: "timestamp",
    })
        .notNull()
        .default(CURRENT_TIMESTAMP)
        .$onUpdate(() => CURRENT_TIMESTAMP),
} as const;

const COMMON_AUTHORED_COLUMNS = {
    created_by: text()
        .notNull()
        .references(() => users[COMMON_COLUMN_ENUM.ID], {
            onDelete: "cascade",
        }),
    updated_by: text()
        .notNull()
        .references(() => users[COMMON_COLUMN_ENUM.ID], {
            onDelete: "cascade",
        }),
} as const;

/**
 * tables
 */
export const users = sqliteTable(
    TABLE_ENUM.USERS,
    {
        ...COMMON_COLUMNS,

        [COMMON_COLUMN_ENUM.ID]: text(),

        /**
         * user username
         */
        [USER_COLUMN_ENUM.NAME]: text().notNull(),

        /**
         * user email address
         */
        [USER_COLUMN_ENUM.EMAIL]: text().notNull().unique(),

        /**
         * is email verified
         */
        [USER_COLUMN_ENUM.EMAIL_VERIFIED]: int({
            mode: "boolean",
        }).default(false),

        /**
         * user image URL
         */
        [USER_COLUMN_ENUM.IMAGE]: text(),

        /**
         * related to admin plugins
         */

        [USER_COLUMN_ENUM.ROLE]: text({
            enum: USER_ROLE_LIST,
        }).default(USER_ROLE_DEFAULT),

        [USER_COLUMN_ENUM.BANNED]: int({
            mode: "boolean",
        }).default(false),

        [USER_COLUMN_ENUM.BAN_REASON]: text(),

        [USER_COLUMN_ENUM.BAN_EXPIRES]: int({
            mode: "timestamp",
        }),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.USERS_EMAIL).on(table[USER_COLUMN_ENUM.EMAIL]),
    ]
);
export const sessions = sqliteTable(
    TABLE_ENUM.SESSIONS,
    {
        ...COMMON_COLUMNS,

        /**
         * primary key for the session table
         */
        [COMMON_COLUMN_ENUM.ID]: text(),

        /**
         * references the user table (id)
         */
        [SESSION_COLUMN_ENUM.USER_ID]: text()
            .notNull()
            .references(() => users[COMMON_COLUMN_ENUM.ID], {
                onDelete: "cascade",
            }),

        [SESSION_COLUMN_ENUM.TOKEN]: text().notNull().unique(),
        [SESSION_COLUMN_ENUM.EXPIRES_AT]: int({
            mode: "timestamp",
        }).notNull(),

        [SESSION_COLUMN_ENUM.IP_ADDRESS]: text(),
        [SESSION_COLUMN_ENUM.USER_AGENT]: text(),
        [SESSION_COLUMN_ENUM.IMPERSONATED_BY]: text(),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.SESSION_USER_ID).on(
            table[SESSION_COLUMN_ENUM.USER_ID]
        ),
        index(INDEXES_ENUM.SESSION_TOKEN).on(table[SESSION_COLUMN_ENUM.TOKEN]),
    ]
);

export const accounts = sqliteTable(
    TABLE_ENUM.ACCOUNTS,
    {
        ...COMMON_COLUMNS,

        /**
         * primary key for the account table
         */
        [COMMON_COLUMN_ENUM.ID]: text(),

        /**
         * references the user table (id)
         */
        [ACCOUNT_COLUMN_ENUM.USER_ID]: text()
            .notNull()
            .references(() => users[COMMON_COLUMN_ENUM.ID], {
                onDelete: "cascade",
            }),

        [ACCOUNT_COLUMN_ENUM.ACCOUNT_ID]: text().notNull(),
        [ACCOUNT_COLUMN_ENUM.PROVIDER_ID]: text().notNull(),
        [ACCOUNT_COLUMN_ENUM.ACCESS_TOKEN]: text(),
        [ACCOUNT_COLUMN_ENUM.REFRESH_TOKEN]: text(),
        [ACCOUNT_COLUMN_ENUM.ACCESS_TOKEN_EXPIRES_AT]: int({
            mode: "timestamp",
        }),
        [ACCOUNT_COLUMN_ENUM.REFRESH_TOKEN_EXPIRES_AT]: int({
            mode: "timestamp",
        }),
        [ACCOUNT_COLUMN_ENUM.SCOPE]: text(),
        [ACCOUNT_COLUMN_ENUM.ID_TOKEN]: text(),
        [ACCOUNT_COLUMN_ENUM.PASSWORD]: text(),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.ACCOUNTS_USER_ID).on(
            table[ACCOUNT_COLUMN_ENUM.USER_ID]
        ),
    ]
);
export const verifications = sqliteTable(
    TABLE_ENUM.VERIFICATIONS,
    {
        ...COMMON_COLUMNS,

        /**
         * primary key for the verification table
         */
        [COMMON_COLUMN_ENUM.ID]: text(),

        [VERIFICATION_COLUMN_ENUM.IDENTIFIER]: text().notNull(),
        [VERIFICATION_COLUMN_ENUM.VALUE]: text().notNull(),
        [VERIFICATION_COLUMN_ENUM.EXPIRES_AT]: int({
            mode: "timestamp",
        }).notNull(),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.VERIFICATIONS_IDENTIFIER).on(
            table[VERIFICATION_COLUMN_ENUM.IDENTIFIER]
        ),
    ]
);

export const tags = sqliteTable(
    TABLE_ENUM.TAGS,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        [COMMON_COLUMN_ENUM.ID]: int(),
        [TAGS_COLUMN_ENUM.NAME]: text({
            length: 100,
        })
            .notNull()
            .unique(),
        [TAGS_COLUMN_ENUM.SLUG]: text().notNull().unique(),
    },
    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.TAGS_NAME).on(table[TAGS_COLUMN_ENUM.NAME]),
        index(INDEXES_ENUM.TAGS_SLUG).on(table[TAGS_COLUMN_ENUM.SLUG]),
    ]
);

export const locales = sqliteTable(
    TABLE_ENUM.LOCALES,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        [COMMON_COLUMN_ENUM.ID]: int(),
        [LOCALE_COLUMN_ENUM.CODE]: text({
            length: 5,
        })
            .notNull()
            .unique(),
        [LOCALE_COLUMN_ENUM.NAME]: text({
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
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.LOCALES_CODE).on(table[LOCALE_COLUMN_ENUM.CODE]),
        index(INDEXES_ENUM.LOCALES_NAME).on(table[LOCALE_COLUMN_ENUM.NAME]),
    ]
);

export const mimeTypes = sqliteTable(
    TABLE_ENUM.MIME_TYPES,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        [COMMON_COLUMN_ENUM.ID]: int(),
        [MEDIA_MIME_TYPE_COLUMN_ENUM.MIME_TYPE]: text().notNull().unique(),
        [MEDIA_MIME_TYPE_COLUMN_ENUM.TITLE]: text().notNull(),
        [MEDIA_MIME_TYPE_COLUMN_ENUM.DESCRIPTION]: text(),
    },

    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.MIME_TYPES_MIME_TYPE).on(
            table[MEDIA_MIME_TYPE_COLUMN_ENUM.MIME_TYPE]
        ),
    ]
);

export const medias = sqliteTable(
    TABLE_ENUM.MEDIAS,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        [COMMON_COLUMN_ENUM.ID]: int(),

        /**
         * foreign keys
         */
        [MEDIA_COLUMN_ENUM.MEDIA_MIME_TYPE_ID]: int()
            .notNull()
            .references(() => mimeTypes[COMMON_COLUMN_ENUM.ID], {
                onDelete: "cascade",
            }),

        /**
         * general fields
         */
        [MEDIA_COLUMN_ENUM.NAME]: text().notNull(),
        [MEDIA_COLUMN_ENUM.DESCRIPTION]: text(),
        [MEDIA_COLUMN_ENUM.STORAGE_KEY]: text().notNull().unique(),
        [MEDIA_COLUMN_ENUM.SIZE_IN_BYTES]: int().notNull(),

        /**
         * image-kind specific fields
         */
        [MEDIA_COLUMN_ENUM.IMAGE_WIDTH]: int(),
        [MEDIA_COLUMN_ENUM.IMAGE_HEIGHT]: int(),
        [MEDIA_COLUMN_ENUM.IMAGE_ALT_TEXT]: text(),

        /**
         * playable-kind specific fields
         */
        [MEDIA_COLUMN_ENUM.DURATION]: int(),
    } as const,
    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
        }),

        /**
         * indexes
         */
        index(INDEXES_ENUM.MEDIA_NAME).on(table[MEDIA_COLUMN_ENUM.NAME]),
    ]
);

export const mediaTags = sqliteTable(
    TABLE_ENUM.MEDIA_TAGS,
    {
        ...COMMON_COLUMNS,

        [COMMON_COLUMN_ENUM.ID]: int(),
        [MEDIA_TAGS_COLUMN_ENUM.MEDIA_ID]: int()
            .notNull()
            .references(() => medias[COMMON_COLUMN_ENUM.ID], {
                onDelete: "cascade",
            }),
        [MEDIA_TAGS_COLUMN_ENUM.TAG_ID]: int()
            .notNull()
            .references(() => tags[COMMON_COLUMN_ENUM.ID], {
                onDelete: "cascade",
            }),
    },
    (table) => [
        /**
         * primary key
         */
        primaryKey({
            columns: [table[COMMON_COLUMN_ENUM.ID]],
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
        fields: [sessions[SESSION_COLUMN_ENUM.USER_ID]],
        references: [users[COMMON_COLUMN_ENUM.ID]],
    }),
}));

export const accountRelations = relations(accounts, ({ one }) => ({
    user: one(users, {
        fields: [accounts[ACCOUNT_COLUMN_ENUM.USER_ID]],
        references: [users[COMMON_COLUMN_ENUM.ID]],
    }),
}));

export const verificationRelations = relations(verifications, (_) => ({}));

export const mediaMimeTypeRelations = relations(mimeTypes, ({ many }) => ({
    medias: many(medias),
}));

export const mediaRelations = relations(medias, ({ one, many }) => ({
    mediaMimeType: one(mimeTypes, {
        fields: [medias[MEDIA_COLUMN_ENUM.MEDIA_MIME_TYPE_ID]],
        references: [mimeTypes[COMMON_COLUMN_ENUM.ID]],
    }),
    mediaTags: many(mediaTags),
}));

export const localeRelations = relations(locales, (_) => ({}));

export const tagRelations = relations(tags, ({ many }) => ({
    mediaTags: many(mediaTags),
}));

export const mediaTagRelations = relations(mediaTags, ({ one }) => ({
    media: one(medias, {
        fields: [mediaTags[MEDIA_TAGS_COLUMN_ENUM.MEDIA_ID]],
        references: [medias[COMMON_COLUMN_ENUM.ID]],
    }),
    tag: one(tags, {
        fields: [mediaTags[MEDIA_TAGS_COLUMN_ENUM.TAG_ID]],
        references: [tags[COMMON_COLUMN_ENUM.ID]],
    }),
}));
