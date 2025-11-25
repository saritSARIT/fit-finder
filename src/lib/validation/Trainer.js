import { z } from "zod";

export const TrainerSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().optional(),
  types: z.array(z.string()).optional(),
});

export const CommentsSchema = z.object({
  comments: z
    .array(
      z.object({
        traineeName: z.string().min(2, "Trainee name must be at least 2 characters"),
        comment: z.string().min(1, "Comment cannot be empty"),
      })
    )
    .default([])
});