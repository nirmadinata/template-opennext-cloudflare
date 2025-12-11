import { Locale } from "next-intl";

export function isLocale(
    supportedLocales: ReadonlyArray<Locale>,
    locale: string
): locale is Locale {
    return !!locale && supportedLocales.some((l) => l === locale);
}
