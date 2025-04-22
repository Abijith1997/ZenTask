import { z } from "zod";

export const formSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(50),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/\d/, "Must include at least one digit")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must include at least one special character"
      ),
    confirmPassword: z.string(),
    displayName: z.string().trim().min(1, "Display Name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Highlight this field on error
  });
