import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import process from "node:process";

let path = "";
if (process.env.NODE_ENV === "production") {
    path = ".env.production";
} else if (process.env.NODE_ENV === "development") {
    path = ".env.local";
}

config({ path });

export default defineConfig({
    out: "./integrations/db/migrations",
    schema: "./integrations/db/schema.ts",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID,
        token: process.env.CLOUDFLARE_API_TOKEN,
    },
});
