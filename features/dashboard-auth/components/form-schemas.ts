import { z } from "zod";

import { constants } from "@/features/dashboard-auth/lib/constants";

/**
 * Form Schemas
 *
 * Client-side form validation schemas used with react-hook-form.
 * These schemas include user-friendly error messages for UI feedback.
 */

/**
 * Login Form Schema
 */
export const loginFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(
            constants.PASSWORD_MIN_LENGTH,
            `Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters long`
        ),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;

/**
 * Forgot Password Form Schema
 */
export const forgotPasswordFormSchema = z.object({
    email: z.email("Invalid email address"),
});

export type ForgotPasswordFormType = z.infer<typeof forgotPasswordFormSchema>;

/**
 * Reset/Change Password Form Schema
 */
export const resetPasswordFormSchema = z
    .object({
        password: z
            .string("Password is required")
            .min(
                constants.PASSWORD_MIN_LENGTH,
                `Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters long`
            ),
        passwordConfirm: z.string("Please confirm your password"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
    });

export type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>;

/**
 * Welcome/First User Form Schema
 */
export const welcomeFormSchema = z
    .object({
        email: z.email("Invalid email address"),
        username: z
            .string("Username is required")
            .min(
                constants.USERNAME_MIN_LENGTH,
                `Username must be at least ${constants.USERNAME_MIN_LENGTH} characters long`
            ),
        password: z
            .string("Password is required")
            .min(
                constants.PASSWORD_MIN_LENGTH,
                `Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters long`
            ),
        passwordConfirm: z.string("Please confirm your password"),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });

export type WelcomeFormType = z.infer<typeof welcomeFormSchema>;
