"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { resetPasswordFormSchema } from "../components/form-schemas";

export function useChangePasswordForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
        resolver: zodResolver(resetPasswordFormSchema),
        defaultValues: {
            password: "",
            passwordConfirm: "",
        },
    });

    async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
        setIsLoading(true);
        console.log("Change Password values:", values);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }

    return {
        form,
        isLoading,
        onSubmit,
    };
}
