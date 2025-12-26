import type { Locale } from "@/configs/constants";
import type messages from "@/public/locales/en.json";

import { formats } from "@/integrations/i18n/lib/request";

declare module "next-intl" {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof messages;
        Formats: typeof formats;
    }
}
