"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { forgotPasswordFormSchema } from "../components/form-schemas";

export function useForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
        setIsLoading(true);
        console.log("Forgot Password values:", values);
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
