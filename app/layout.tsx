import "./globals.css";

import { Metadata } from "next";

import { DEFAULT_ROOT_METADATA } from "@/configs/constants";
import { geistMono, geistSans } from "@/configs/fonts";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
    return DEFAULT_ROOT_METADATA;
}

type Props = Readonly<{
    children: React.ReactNode;
}>;

export default function Layout({ children }: Props) {
    return (
        <html lang="en">
            <body
                className={cn(
                    `${geistSans.variable} ${geistMono.variable} antialiased`
                )}
            >
                {children}
            </body>
        </html>
    );
}
