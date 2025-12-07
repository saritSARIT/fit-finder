import { z } from "zod";

export const TrainerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().optional(),
  types: z.array(z.string()).optional(),
  comments: z
    .array(
      z.object({
        traineeName: z.string().min(2, "Trainee name must be at least 2 characters"),
        comment: z.string().min(1, "Comment cannot be empty"),
        rating: z.number().min(1, "Day must be at least 1").max(5, "Day must be at most 5"),
        date: z.date()
      })
    )
    .default([])
});