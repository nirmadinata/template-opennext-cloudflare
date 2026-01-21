"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { welcomeFormSchema } from "../components/form-schemas";

export function useWelcomeForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof welcomeFormSchema>>({
        resolver: zodResolver(welcomeFormSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const onSubmit = form.handleSubmit(async function onSubmit(values) {
        setIsLoading(true);
        console.log("Welcome/Register values:", values);
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
