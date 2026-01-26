import { PropsWithChildren } from "react";

import { AuthNavbar } from "@/features/dashboard";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen w-full flex-col">
            <AuthNavbar />
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-87.5 space-y-6">{children}</div>
            </div>
        </div>
    );
}
