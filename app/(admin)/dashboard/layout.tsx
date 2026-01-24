import { Fragment, PropsWithChildren } from "react";

import { redirect } from "next/navigation";

import { serverRpc } from "@/integrations/rpc/server";

export default async function Layout({ children }: PropsWithChildren) {
    const session = await serverRpc.dashboardAuth.getAuthSession();
    if (!session?.session) {
        redirect("/auth/login");
    }

    return <Fragment>{children}</Fragment>;
}
