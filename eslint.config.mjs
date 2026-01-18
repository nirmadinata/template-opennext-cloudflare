/* eslint-disable import/order */
import pluginQuery from "@tanstack/eslint-plugin-query";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import jsoncPlugin from "eslint-plugin-jsonc";
import prettier from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig } from "eslint/config";
import jsoncParser from "jsonc-eslint-parser";

const eslintConfig = defineConfig([
    ...pluginQuery.configs["flat/recommended"],
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            "out/**",
            "build/**",
            "next-env.d.ts",
            ".wrangler/**",
            "dist/**",
            "public/**",
            ".open-next/**",
            ".eslintcache",
            "src/adapters/d1/migrations/meta/**",
            "src/adapters/public-api/typegen.ts",
            ".eslintcache",
            "cloudflare-env.d.ts",
            "**/migrations/**",
        ],
    },
    ...nextVitals,
    ...nextTs,
    {
        plugins: {
            import: importPlugin,
            "unused-imports": unusedImports,
            prettier: prettier,
        },
        rules: {
            // Prettier integration
            "prettier/prettier": "error",

            // Indentation - 4 spaces

            // TypeScript rules
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off", // Handled by unused-imports

            // Unused imports and variables - automatic removal
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "error",
                {
                    vars: "all",
                    varsIgnorePattern: "^_",
                    args: "after-used",
                    argsIgnorePattern: "^_",
                },
            ],

            // Prefer const over let when variable is never reassigned
            "prefer-const": [
                "error",
                {
                    destructuring: "all",
                    ignoreReadBeforeAssign: false,
                },
            ],

            // Import order - type imports, external packages, internal files
            "import/order": [
                "error",
                {
                    groups: [
                        "type",
                        ["builtin", "external"],
                        ["internal", "parent", "sibling", "index"],
                    ],
                    pathGroups: [
                        {
                            pattern: "react",
                            group: "external",
                            position: "before",
                        },
                        {
                            pattern: "next/**",
                            group: "external",
                            position: "before",
                        },
                        {
                            pattern: "@/**",
                            group: "internal",
                        },
                        {
                            pattern: "~/**",
                            group: "internal",
                        },
                    ],
                    pathGroupsExcludedImportTypes: ["type"],
                    "newlines-between": "always",
                    alphabetize: {
                        order: "asc",
                        caseInsensitive: true,
                    },
                },
            ],

            // Ensure imports are valid
            "import/no-unresolved": "off", // TypeScript handles this
            "import/named": "off", // TypeScript handles this
            "import/namespace": "off", // TypeScript handles this
            "import/default": "off", // TypeScript handles this
            "import/no-named-as-default-member": "off",
        },
    },
    // JSON and JSONC files configuration
    {
        files: ["**/*.json", "**/*.jsonc"],
        plugins: {
            jsonc: jsoncPlugin,
        },
        languageOptions: {
            parser: jsoncParser,
        },
        rules: {
            ...jsoncPlugin.configs["recommended-with-jsonc"].rules,
            "jsonc/indent": ["error", 4],
            "jsonc/sort-keys": "off",
        },
    },
    // Prettier compatibility - must be last
    prettierConfig,
]);

export default eslintConfig;
