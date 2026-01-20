import { PropsWithChildren } from "react";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4">
            <div className="w-full max-w-87.5 space-y-6">{children}</div>
        </div>
    );
}
