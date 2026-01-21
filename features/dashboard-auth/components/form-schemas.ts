import { z } from "zod";

import { constants } from "@/features/dashboard-auth/lib/constants";

export const loginFormSchema = z.object({
    email: z.email("Invalid email address"),
    password: z
        .string()
        .min(
            constants.PASSWORD_MIN_LENGTH,
            `Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters long`
        ),
});

export const forgotPasswordFormSchema = z.object({
    email: z.email("Invalid email address"),
});

export const resetPasswordFormSchema = z
    .object({
        password: z
            .string()
            .min(
                constants.PASSWORD_MIN_LENGTH,
                `Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters long`
            ),

        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
    });

export const welcomeFormSchema = z
    .object({
        email: z.email("Invalid email address"),
        username: z
            .string()
            .min(
                constants.USERNAME_MIN_LENGTH,
                `Username must be at least ${constants.USERNAME_MIN_LENGTH} characters long`
            ),
        password: z
            .string()
            .min(
                constants.PASSWORD_MIN_LENGTH,
                `Password must be at least ${constants.PASSWORD_MIN_LENGTH} characters long`
            ),
        passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
        message: "Passwords do not match",
        path: ["passwordConfirm"],
    });
