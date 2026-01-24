import { Metadata } from "next";

import { LoginForm } from "@/features/dashboard-auth/components";

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
};

export default function LoginPage() {
    return <LoginForm />;
}
