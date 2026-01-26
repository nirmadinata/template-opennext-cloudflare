import {
    Home,
    Settings,
    Users,
    FileText,
    BarChart3,
    type LucideIcon,
} from "lucide-react";

/**
 * Sidebar menu item type
 */
export type SidebarMenuItem = {
    title: string;
    url: string;
    icon: LucideIcon;
    items?: {
        title: string;
        url: string;
    }[];
};

/**
 * Main sidebar menu configuration
 *
 * Each item can have optional sub-items for collapsible navigation.
 * Icons are from lucide-react.
 */
export const SIDEBAR_MENU_ITEMS: SidebarMenuItem[] = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
        items: [
            {
                title: "All Users",
                url: "/dashboard/users",
            },
            {
                title: "Roles",
                url: "/dashboard/users/roles",
            },
        ],
    },
    {
        title: "Content",
        url: "/dashboard/content",
        icon: FileText,
        items: [
            {
                title: "Pages",
                url: "/dashboard/content/pages",
            },
            {
                title: "Media",
                url: "/dashboard/content/media",
            },
        ],
    },
    {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

/**
 * User dropdown menu items
 */
export const USER_DROPDOWN_ITEMS = [
    {
        title: "Profile",
        url: "/dashboard/profile",
    },
] as const;
