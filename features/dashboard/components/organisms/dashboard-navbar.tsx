"use client";

import { Menu } from "lucide-react";

import { Logo } from "../atoms/logo";
import { ThemeSwitcher } from "../atoms/theme-switcher";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

/**
 * Dashboard navbar component
 *
 * Displays:
 * - Mobile menu toggle button
 * - Logo (visible on mobile when sidebar is hidden)
 * - Theme switcher
 */
export function DashboardNavbar() {
    const { toggleSidebar, isMobile } = useSidebar();

    return (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
            <div className="flex h-14 items-center gap-4 px-4 md:px-6">
                {/* Mobile menu button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle sidebar</span>
                </Button>

                {/* Logo - visible on mobile */}
                {isMobile && <Logo className="md:hidden" />}

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
