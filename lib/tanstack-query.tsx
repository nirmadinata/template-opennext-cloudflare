import type { TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools";

import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

export const tanstackQueryClient = new QueryClient({});

export const tanstackQueryPlugins: TanStackDevtoolsReactPlugin[] = [
    {
        name: "TStack Form",
        defaultOpen: false,
        render() {
            return <FormDevtoolsPanel />;
        },
    },
    {
        name: "TStack Query",
        defaultOpen: false,
        render() {
            return <ReactQueryDevtoolsPanel />;
        },
    },
];
