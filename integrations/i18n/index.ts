"use server";

import { cookies } from "next/headers";

import { Locale } from "next-intl";

import { COOKIE_NAMES, DEFAULT_LOCALE, LOCALES } from "@/configs/constants";

export async function getUserLocale() {
    const value = (await cookies()).get(COOKIE_NAMES.LOCALE)?.value as Locale;
    return value || DEFAULT_LOCALE;
}

export async function setUserLocale(locale: Locale) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAMES.LOCALE, locale);
}

export async function onChangeLocale() {
    const locale = await getUserLocale();

    setUserLocale(locale === LOCALES.EN ? LOCALES.AR : LOCALES.EN);
}
