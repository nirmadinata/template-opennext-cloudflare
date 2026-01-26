"use client";

import * as React from "react";

import { SIDEBAR_MENU_ITEMS } from "../../lib/constants";
import { Logo } from "../atoms/logo";
import { NavMain } from "../molecules/nav-main";
import { NavUser } from "../molecules/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
};

/**
 * Inner sidebar component that has access to sidebar context
 */
function SidebarInner({ user }: { user: AppSidebarProps["user"] }) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <>
            <SidebarHeader className="border-sidebar-border border-b">
                <Logo collapsed={isCollapsed} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={SIDEBAR_MENU_ITEMS} label="Menu" />
            </SidebarContent>
            <SidebarFooter className="border-sidebar-border border-t">
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </>
    );
}

/**
 * Main application sidebar component
 *
 * Features:
 * - Collapsible with icon-only mode (Cmd/Ctrl + B)
 * - Logo in header
 * - Navigation menu with collapsible sub-items
 * - User dropdown in footer
 * - Mobile responsive (sheet overlay)
 */
export function AppSidebar({ user, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarInner user={user} />
        </Sidebar>
    );
}
