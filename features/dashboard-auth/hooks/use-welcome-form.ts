"use client";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { welcomeFormSchema } from "@/features/dashboard-auth/components/form-schemas";
import { orpc } from "@/integrations/rpc/client";

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

    const router = useRouter();

    const { mutateAsync: createUser, isPending: isLoadingCreateUser } =
        useMutation(
            orpc.dashboardAuth.createFirstUser.mutationOptions({
                async onSuccess({ user }, ___) {
                    if (!user) {
                        toast.error(`Error creating user`);

                        return;
                    }

                    toast.success(`User ${user.email} created successfully!`);
                    router.refresh();
                },
                async onError(error, { email }) {
                    console.error(error);
                    toast.error(`Error creating user: ${email}`);
                },
            })
        );

    const onSubmit = form.handleSubmit((v) => createUser(v));
    const isLoading = isLoadingCreateUser;

    return {
        form,
        isLoading,
        onSubmit,
    };
}
