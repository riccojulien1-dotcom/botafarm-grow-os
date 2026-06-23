import { z } from "zod";

export const signInSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(6, "Password must contain at least 6 characters."),
});

export const signUpSchema = signInSchema.extend({
  username: z
    .string()
    .min(2, "Username must contain at least 2 characters.")
    .max(32, "Username must contain at most 32 characters."),
  language: z.enum(["en", "fr"]).default("en"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must contain at least 6 characters."),
    confirmPassword: z.string().min(6, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
