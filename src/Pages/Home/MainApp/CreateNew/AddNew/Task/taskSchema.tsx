import { z } from "zod";

export const taskSchema = z.object({
  Title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"), // optional, for better UX
  description: z.string().optional(),
  Due: z.string().optional(),
  id: z.string().optional(),
  uid: z.string().optional(),
  completed: z.boolean().optional(),
  created_at: z.string().optional(),
});

export const userSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  display_name: z.string(),
  phone: z.string().optional(),
  avatar_url: z.string().optional(),
});
