import { formats } from "@/adapters/i18n/lib/request";
import { Locale } from "@/configs/constants";
import messages from "@/public/locales/en.json";

declare module "next-intl" {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof messages;
        Formats: typeof formats;
    }
}
