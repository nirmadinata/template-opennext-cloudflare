"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { loginFormSchema } from "../components/form-schemas";

export function useLoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = form.handleSubmit(async function onSubmit(values) {
        setIsLoading(true);
        console.log("Login values:", values);
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
