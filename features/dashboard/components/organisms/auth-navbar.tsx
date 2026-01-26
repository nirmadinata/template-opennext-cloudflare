"use client";

import { Logo } from "../atoms/logo";
import { ThemeSwitcher } from "../atoms/theme-switcher";

/**
 * Auth navbar component
 *
 * Simplified navbar for authentication pages.
 * Displays logo and theme switcher.
 */
export function AuthNavbar() {
    return (
        <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <div className="flex h-14 items-center gap-4 px-4 md:px-6">
                {/* Logo */}
                <Logo />

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right side actions */}
                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                </div>
            </div>
        </header>
    );
}
