import { z } from "zod";

import { constants } from "@/features/dashboard-auth/lib/constants";

export const onboardFirstTimeSchema = {
    input: z

        .object({
            email: z.email("Invalid email address"),
            username: z
                .string()
                .min(
                    constants.USERNAME_MIN_LENGTH,
                    `Username should be at least ${constants.USERNAME_MIN_LENGTH} characters long`
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
        }),

    output: z.void(),
};
