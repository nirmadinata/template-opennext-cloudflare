"use client";

import * as React from "react";

import { useChangePasswordForm } from "../../hooks/use-change-password-form"; // Updated import
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

type ChangePasswordFormProps = React.HTMLAttributes<HTMLDivElement>;

export function ChangePasswordForm({
    className,
    ...props
}: ChangePasswordFormProps) {
    const { form, isLoading, onSubmit } = useChangePasswordForm(); // Use hook

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <AuthHeader
                title="Change Password"
                description="Enter your new password below"
            />

            <Form {...form}>
                <form className="grid gap-4" onSubmit={onSubmit}>
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="passwordConfirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        autoComplete="new-password"
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
                        Change Password
                    </Button>
                </form>
            </Form>
        </div>
    );
}
