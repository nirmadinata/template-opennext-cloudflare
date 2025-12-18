import { cookies } from "next/headers";

import { Formats } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import {
    DEFAULT_LOCALE,
    LOCALE_TIMEZONE,
    SUPPORTED_LOCALES,
} from "@/configs/constants";
import { COOKIE_NAMES } from "@/configs/constants";
import { isLocale } from "@/integrations/i18n/lib/util";

export const formats = {
    dateTime: {
        short: {
            day: "numeric",
            month: "short",
            year: "numeric",
        },
    },
    number: {
        precise: {
            maximumFractionDigits: 5,
        },
    },
    list: {
        enumeration: {
            style: "long",
            type: "conjunction",
        },
    },
} satisfies Formats;

export default getRequestConfig(async () => {
    const store = await cookies();
    const locale = store.get(COOKIE_NAMES.LOCALE)?.value || DEFAULT_LOCALE;

    /**
     * if no locale is set in cookies or
     * if the locale from cookies is not supported, return the default locale
     */
    if (!isLocale(SUPPORTED_LOCALES, locale)) {
        const locale = DEFAULT_LOCALE;
        return {
            formats,
            locale,
            timeZone: LOCALE_TIMEZONE[locale],
            messages: (await import(`@/public/locales/${locale}.json`)).default,
        };
    }

    return {
        formats,
        locale,
        timeZone: LOCALE_TIMEZONE[locale],
        messages: (await import(`@/public/locales/${locale}.json`)).default,
    };
});
