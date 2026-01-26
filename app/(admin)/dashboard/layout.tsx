import { PropsWithChildren } from "react";

import { redirect } from "next/navigation";

import { DashboardLayout } from "@/features/dashboard";
import { serverRpc } from "@/integrations/rpc/server";

export default async function Layout({ children }: PropsWithChildren) {
    const session = await serverRpc.dashboardAuth.getAuthSession();
    if (!session?.session) {
        redirect("/auth/login");
    }

    // Provide user data to the dashboard layout
    const user = {
        name: session.user?.name || "User",
        email: session.user?.email || "",
        image: session.user?.image,
    };

    return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
