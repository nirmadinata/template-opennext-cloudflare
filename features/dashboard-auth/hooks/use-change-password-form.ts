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

    const onSubmit = form.handleSubmit(async function onSubmit(values) {
        setIsLoading(true);
        console.log("Change Password values:", values);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setIsLoading(false);
    });

    return {
        form,
        isLoading,
        onSubmit,
    };
}
