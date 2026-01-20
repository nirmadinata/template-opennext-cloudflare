"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { loginFormSchema } from "../components/form-schemas";

export function useLoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof loginFormSchema>) {
        setIsLoading(true);
        console.log("Login values:", values);
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
