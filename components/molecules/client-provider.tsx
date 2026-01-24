"use client";

import { PropsWithChildren } from "react";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";

import { LocaleChangeHandler } from "./locale-change-handler";
import { tanstackQueryClient, tanstackPlugins } from "@/lib/tanstack-query";

type Props = PropsWithChildren;

export function ClientProvider({ children }: Props) {
    return (
        <QueryClientProvider client={tanstackQueryClient}>
            {children}
            <TanStackDevtools plugins={tanstackPlugins} />
            <LocaleChangeHandler />
        </QueryClientProvider>
    );
}
