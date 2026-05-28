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
  language: z.enum(["fr", "en", "de", "es"]).default("fr"),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
