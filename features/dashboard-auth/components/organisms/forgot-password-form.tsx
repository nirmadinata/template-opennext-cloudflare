"use client";

import * as React from "react";

import Link from "next/link";

import { useForgotPasswordForm } from "../../hooks/use-forgot-password-form"; // Updated import
import { AuthHeader } from "../molecules/auth-header";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ForgotPasswordFormProps = React.HTMLAttributes<HTMLDivElement>;

export function ForgotPasswordForm({
    className,
    ...props
}: ForgotPasswordFormProps) {
    const { form, isLoading, onSubmit } = useForgotPasswordForm(); // Use hook

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <AuthHeader
                title="Forgot Password"
                description="Enter your email address to reset your password"
            />

            <Form {...form}>
                <form onSubmit={onSubmit} className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && (
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        )}
                        Send Reset Link
                    </Button>
                </form>
            </Form>
            <div className="text-muted-foreground text-center text-sm">
                <Link
                    href="/auth/login"
                    className="hover:text-primary underline underline-offset-4"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
}
