import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(3, "Username must be at-least 3 characters long")
  .max(15, "Username must be no more that 15 characters long")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Please provide a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at-least 6 characters long" }),
});
