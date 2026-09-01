import { z } from "zod";
import { MIN_PASSWORD_LENGTH, PLATFORM_ROLES } from "./constants";

const password = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
  );

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
  password,
  role: z.enum(PLATFORM_ROLES),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Enter a valid email address"),
});

export const setPasswordSchema = z
  .object({
    newPassword: password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const banUserSchema = z.object({
  banReason: z.string().min(1, "A reason is required"),
  duration: z.enum(["permanent", "1d", "7d", "30d"]),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type UpdateUserValues = z.infer<typeof updateUserSchema>;
export type SetPasswordValues = z.infer<typeof setPasswordSchema>;
export type BanUserValues = z.infer<typeof banUserSchema>;
