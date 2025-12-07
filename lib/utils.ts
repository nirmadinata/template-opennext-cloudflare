import { cn as _cn } from "@sglara/cn";

export function cn(
    ...classes: (string | Record<string, boolean> | undefined)[]
) {
    return _cn(...classes);
}
