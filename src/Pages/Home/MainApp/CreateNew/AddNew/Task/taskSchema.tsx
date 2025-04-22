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
