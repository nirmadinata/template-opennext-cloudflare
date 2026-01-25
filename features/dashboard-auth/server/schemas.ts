import { z } from "zod";

import { constants } from "@/features/dashboard-auth/lib/constants";

/**
 * Server Schemas
 *
 * RPC input/output schemas for server-side procedures.
 * These schemas are used for API validation and type inference.
 */

/**
 * Create First User Input Schema (for RPC)
 */
export const createFirstUserInputSchema = z.object({
    email: z.email(),
    username: z
        .string()
        .min(constants.USERNAME_MIN_LENGTH)
        .max(constants.USERNAME_MAX_LENGTH),
    password: z
        .string()
        .min(constants.PASSWORD_MIN_LENGTH)
        .max(constants.PASSWORD_MAX_LENGTH),
});

export type CreateFirstUserInputType = z.infer<
    typeof createFirstUserInputSchema
>;

/**
 * Auth Session Response Schema
 */
export const authSessionResponseSchema = z.object({
    session: z.any().nullable(),
    user: z.any().nullable(),
});

export type AuthSessionResponseType = z.infer<typeof authSessionResponseSchema>;

/**
 * First User Check Response Schema
 */
export const isFirstUserResponseSchema = z.object({
    value: z.boolean(),
});

export type IsFirstUserResponseType = z.infer<typeof isFirstUserResponseSchema>;

/**
 * Create User Response Schema
 */
export const createUserResponseSchema = z.object({
    user: z.any(),
});

export type CreateUserResponseType = z.infer<typeof createUserResponseSchema>;
