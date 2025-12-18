import { Locale } from "@/configs/constants";
import { formats } from "@/integrations/i18n/lib/request";
import messages from "@/public/locales/en.json";

declare module "next-intl" {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof messages;
        Formats: typeof formats;
    }
}
