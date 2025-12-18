import { relations } from "drizzle-orm";
import {
    index,
    int,
    primaryKey,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import {
    COMMON_COLUMN_ENUM,
    USER_ROLE_DEFAULT,
    TABLE_ENUM,
    USER_COLUMN_ENUM,
    USER_ROLE_LIST,
    COMMON_AUTHORED_COLUMN_ENUM,
    SESSION_COLUMN_ENUM,
    ACCOUNT_COLUMN_ENUM,
    VERIFICATION_COLUMN_ENUM,
    LOCALE_COLUMN_ENUM,
    MEDIA_MIME_TYPE_COLUMN_ENUM,
    MEDIA_COLUMN_ENUM,
    TAGS_COLUMN_ENUM,
} from "@/integrations/d1/constants";

const COMMON_COLUMNS = {
    [COMMON_COLUMN_ENUM.CREATED_AT]: int({
        mode: "timestamp",
    })
        .notNull()
        .$default(() => new Date()),
    [COMMON_COLUMN_ENUM.UPDATED_AT]: int({
        mode: "timestamp",
    })
        .notNull()
        .$default(() => new Date())
        .$onUpdateFn(() => new Date()),
} as const;

const COMMON_AUTHORED_COLUMNS = {
    [COMMON_AUTHORED_COLUMN_ENUM.CREATED_BY]: text()
        .notNull()
        .references(() => users[COMMON_COLUMN_ENUM.ID], {
            onDelete: "cascade",
        }),
    [COMMON_AUTHORED_COLUMN_ENUM.UPDATED_BY]: text()
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
         * user role
         */
        [USER_COLUMN_ENUM.ROLE]: text({
            enum: [...USER_ROLE_LIST],
        }).default(USER_ROLE_DEFAULT),

        /**
         * is user banned
         */
        [USER_COLUMN_ENUM.BANNED]: int({
            mode: "boolean",
        }).default(false),

        /**
         * reason for banning the user
         */
        [USER_COLUMN_ENUM.BAN_REASON]: text(),

        /**
         * when the ban expires
         */
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
        index("idx_users_email").on(table[USER_COLUMN_ENUM.EMAIL]),
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
            .references(() => users.id, {
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
        index("idx_sessions_user_id").on(table[SESSION_COLUMN_ENUM.USER_ID]),
        index("idx_sessions_token").on(table[SESSION_COLUMN_ENUM.TOKEN]),
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
            .references(() => users.id, {
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
        index("idx_accounts_user_id").on(table[ACCOUNT_COLUMN_ENUM.USER_ID]),
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
        index("idx_verifications_identifier").on(
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
        index("idx_tags_name").on(table[TAGS_COLUMN_ENUM.NAME]),
        index("idx_tags_slug").on(table[TAGS_COLUMN_ENUM.SLUG]),
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
        index("idx_locales_code").on(table[LOCALE_COLUMN_ENUM.CODE]),
        index("idx_locales_name").on(table[LOCALE_COLUMN_ENUM.NAME]),
    ]
);

export const mediaMimeTypes = sqliteTable(
    TABLE_ENUM.MEDIA_MIME_TYPES,
    {
        ...COMMON_COLUMNS,
        ...COMMON_AUTHORED_COLUMNS,

        [COMMON_COLUMN_ENUM.ID]: int(),
        [MEDIA_MIME_TYPE_COLUMN_ENUM.MIME_TYPE]: text().notNull().unique(),
        [MEDIA_MIME_TYPE_COLUMN_ENUM.TITLE]: text(),
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
        index("idx_media_mime_types_mime_type").on(
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
            .references(() => mediaMimeTypes.id, {
                onDelete: "cascade",
            }),

        /**
         * general fields
         */
        [MEDIA_COLUMN_ENUM.NAME]: text(),
        [MEDIA_COLUMN_ENUM.DESCRIPTION]: text(),
        [MEDIA_COLUMN_ENUM.STORAGE_KEY]: text().notNull().unique(),
        [MEDIA_COLUMN_ENUM.SIZE_IN_BYTES]: int().notNull(),
        [MEDIA_COLUMN_ENUM.TAGS]: text({
            mode: "json",
        }),

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
        index("idx_medias_name").on(table[MEDIA_COLUMN_ENUM.NAME]),
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

export const mediaMimeTypeRelations = relations(mediaMimeTypes, ({ many }) => ({
    medias: many(medias),
}));

export const mediaRelations = relations(medias, ({ one }) => ({
    mediaMimeType: one(mediaMimeTypes, {
        fields: [medias[MEDIA_COLUMN_ENUM.MEDIA_MIME_TYPE_ID]],
        references: [mediaMimeTypes[COMMON_COLUMN_ENUM.ID]],
    }),
}));

export const localeRelations = relations(locales, ({}) => ({}));

export const tagRelations = relations(tags, ({}) => ({}));

export const tagsRelations = relations(tags, ({}) => ({}));

export const insertUserSchema = createInsertSchema(users);
