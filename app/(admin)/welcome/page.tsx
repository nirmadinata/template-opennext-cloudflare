import { redirect } from "next/navigation";

import { Metadata } from "next";

import { WelcomeForm } from "@/features/dashboard-auth/components";
import { serverRpc } from "@/integrations/rpc/server";

export const metadata: Metadata = {
    title: "Welcome",
    description: "Create your account",
};

export default async function WelcomePage() {
    const res = await serverRpc.dashboardAuth.checkFirstTimeOnboard({});
    if (!res.isFirstTime) {
        redirect("/auth/login");
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-87.5 space-y-6">
                <WelcomeForm />
            </div>
        </div>
    );
}
