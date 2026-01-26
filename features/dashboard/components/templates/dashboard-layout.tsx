"use client";

import { PropsWithChildren } from "react";

import { AppSidebar } from "../organisms/app-sidebar";
import { DashboardNavbar } from "../organisms/dashboard-navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardLayoutProps = PropsWithChildren<{
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
    defaultSidebarOpen?: boolean;
}>;

/**
 * Dashboard layout wrapper component
 *
 * Provides the complete dashboard structure:
 * - SidebarProvider for sidebar state management
 * - Collapsible sidebar with navigation
 * - Top navbar with theme switcher
 * - Content area with proper padding
 *
 * Usage in layout.tsx:
 * ```tsx
 * const session = await serverRpc.dashboardAuth.getAuthSession();
 * return (
 *   <DashboardLayout user={session.user}>
 *     {children}
 *   </DashboardLayout>
 * );
 * ```
 */
export function DashboardLayout({
    children,
    user,
    defaultSidebarOpen = true,
}: DashboardLayoutProps) {
    return (
        <SidebarProvider defaultOpen={defaultSidebarOpen}>
            <AppSidebar user={user} />
            <SidebarInset>
                <DashboardNavbar />
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
