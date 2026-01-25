"use client";

import * as React from "react";

import { useWelcomeForm } from "../../hooks/use-welcome-form";
import { PasswordStrengthMeter } from "../atoms/password-strength-meter";
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

type WelcomeFormProps = React.HTMLAttributes<HTMLDivElement>;

export function WelcomeForm({ className, ...props }: WelcomeFormProps) {
    const { form, isLoading, onSubmit } = useWelcomeForm();

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <AuthHeader
                title="Welcome Aboard!"
                description="Enter your information below to create your account"
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
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="username"
                                        type="text"
                                        autoCapitalize="none"
                                        autoCorrect="off"
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="••••••••"
                                        type="password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <PasswordStrengthMeter password={field.value} />
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
                        Create Account
                    </Button>
                </form>
            </Form>
        </div>
    );
}
