"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
    collapsed?: boolean;
    className?: string;
};

/**
 * Application logo component
 *
 * Displays either full logo with text or just icon when collapsed.
 */
export function Logo({ collapsed = false, className }: LogoProps) {
    return (
        <Link
            href="/dashboard"
            className={cn(
                "flex items-center gap-2 font-semibold",
                collapsed && "justify-center",
                className
            )}
        >
            <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <span className="text-sm font-bold">T</span>
            </div>
            {!collapsed && (
                <span className="text-foreground truncate text-lg">
                    Template
                </span>
            )}
        </Link>
    );
}
