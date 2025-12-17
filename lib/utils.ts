import { cn as _cn } from "@sglara/cn";

type ClassValue = Parameters<typeof _cn>[number];

export function cn(...classes: ClassValue[]) {
    return _cn(...classes);
}
