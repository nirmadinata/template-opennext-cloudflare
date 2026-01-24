"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { welcomeFormSchema } from "@/features/dashboard-auth/components/form-schemas";
import { authClient } from "@/integrations/auth/client";
import { ROLE_ENUM } from "@/integrations/auth/constants";

export function useWelcomeForm() {
    const form = useForm({
        resolver: zodResolver(welcomeFormSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const { mutateAsync: createUser, isPending: isLoadingCreateUser } =
        useMutation({
            async mutationFn(param: z.infer<typeof welcomeFormSchema>) {
                return await authClient.admin.createUser({
                    role: ROLE_ENUM.SUPERADMIN,
                    email: param.email,
                    name: param.username,
                    password: param.password,
                });
            },
            async onSuccess({ error, data }, ___) {
                if (error) {
                    console.error(`Error creating user: ${error.message}`);
                    toast.error(`Error creating user`);

                    return;
                }

                toast.success(`User ${data.user.email} created successfully!`);
            },
            async onError(error, { email }) {
                console.error(error);
                toast.error(`Error creating user: ${email}`);
            },
        });

    const onSubmit = form.handleSubmit((v) => createUser(v));
    const isLoading = isLoadingCreateUser;

    return {
        form,
        isLoading,
        onSubmit,
    };
}
