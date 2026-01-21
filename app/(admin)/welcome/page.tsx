import { Metadata } from "next";

import { WelcomeForm } from "@/features/dashboard-auth/components";

export const metadata: Metadata = {
    title: "Welcome",
    description: "Create your account",
};

export default function WelcomePage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-87.5 space-y-6">
                <WelcomeForm />
            </div>
        </div>
    );
}
