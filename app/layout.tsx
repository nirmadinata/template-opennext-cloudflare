import "./globals.css";

import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { ClientProvider } from "@/components/molecules/client-provider";
import { DEFAULT_ROOT_METADATA } from "@/configs/constants";
import { geistMono, geistSans } from "@/configs/fonts";

export async function generateMetadata(): Promise<Metadata> {
    return DEFAULT_ROOT_METADATA;
}

type Props = Readonly<{
    children: React.ReactNode;
}>;

export default async function Layout({ children }: Props) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>{/* Put favicon here */}</head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider>
                        <NuqsAdapter>
                            <ClientProvider>{children}</ClientProvider>
                        </NuqsAdapter>
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
