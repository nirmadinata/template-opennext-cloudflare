import config from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "node:path";
import process from "node:process";

config.config({
    path: path.resolve(process.cwd(), ".env.development"),
});

export default defineConfig({
    out: "./integrations/d1/migrations",
    schema: "./integrations/d1/schema.ts",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
        accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
        databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
        token: process.env.CLOUDFLARE_API_TOKEN!,
    },
});
