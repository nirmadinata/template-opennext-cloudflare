"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { loginFormSchema } from "@/features/dashboard-auth/components/form-schemas";
import { authClient } from "@/integrations/auth/client";

export function useLoginForm() {
    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { mutateAsync: loginByEmail, isPending: isLoadingLoginByEmail } =
        useMutation({
            async mutationFn(param: z.infer<typeof loginFormSchema>) {
                return await authClient.signIn.email({
                    email: param.email,
                    password: param.password,
                    rememberMe: true,
                    callbackURL: "/dashboard",
                });
            },
            async onSuccess({ error, data }, ___) {
                if (error) {
                    console.error(`Error login: ${error.message}`);
                    toast.error(`Error logging in`);

                    return;
                }

                toast.success(
                    `User ${data.user.email} logged in successfully!`
                );
            },
            async onError(error, { email }) {
                console.error(error);
                toast.error(`Error logging in: ${email}`);
            },
        });

    const { mutateAsync: loginByGoogle, isPending: isLoadingLoginByGoogle } =
        useMutation({
            async mutationFn() {
                return authClient.signIn.social({
                    provider: "google",
                    callbackURL: "/dashboard",
                    requestSignUp: false,
                });
            },
            async onSuccess({ error }, ___) {
                if (error) {
                    console.error(`Error login: ${error.message}`);
                    toast.error(`Error logging in`);
                }
            },
            async onError(error) {
                console.error(error);
            },
        });

    const onSubmitLoginByEmail = form.handleSubmit((v) => loginByEmail(v));
    const onSubmitLoginByGoogle = () => loginByGoogle();
    const isLoading = isLoadingLoginByEmail || isLoadingLoginByGoogle;

    return {
        form,
        isLoading,
        onSubmitLoginByEmail,
        onSubmitLoginByGoogle,
    };
}
