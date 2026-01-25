import { redirect } from "next/navigation";

import { LoginForm } from "@/features/dashboard-auth/components";
import { serverRpc } from "@/integrations/rpc/server";

export default async function LoginPage() {
    const session = await serverRpc.dashboardAuth.getAuthSession();
    if (session.session) {
        redirect("/dashboard");
    }

    const res = await serverRpc.dashboardAuth.checkIsFirstTimeUser();
    if (res.value) {
        redirect("/welcome");
    }

    return <LoginForm />;
}
