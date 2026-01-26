"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronRight } from "lucide-react";

import { type SidebarMenuItem as SidebarMenuItemType } from "../../lib/constants";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";

type NavMainProps = {
    items: SidebarMenuItemType[];
    label?: string;
};

/**
 * Main navigation component for sidebar
 *
 * Renders menu items with optional collapsible sub-items.
 * Highlights active items based on current pathname.
 */
export function NavMain({ items, label = "Navigation" }: NavMainProps) {
    const pathname = usePathname();

    /**
     * Check if a menu item or its children are active
     */
    const isItemActive = (item: SidebarMenuItemType): boolean => {
        if (pathname === item.url) return true;
        if (item.items) {
            return item.items.some((subItem) => pathname === subItem.url);
        }
        return false;
    };

    /**
     * Check if a sub-item is active
     */
    const isSubItemActive = (url: string): boolean => {
        return pathname === url;
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = isItemActive(item);
                    const hasSubItems = item.items && item.items.length > 0;

                    if (hasSubItems) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={isActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isActive}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items!.map((subItem) => (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isSubItemActive(
                                                            subItem.url
                                                        )}
                                                    >
                                                        <Link
                                                            href={subItem.url}
                                                        >
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={isActive}
                            >
                                <Link href={item.url}>
                                    <Icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
