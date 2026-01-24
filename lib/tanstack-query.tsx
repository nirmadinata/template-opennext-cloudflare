import type { TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools";

import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

export const tanstackQueryClient = new QueryClient({});

export const tanstackPlugins: TanStackDevtoolsReactPlugin[] = [
    {
        name: "TStack Query",
        defaultOpen: false,
        render() {
            return <ReactQueryDevtoolsPanel />;
        },
    },
];
