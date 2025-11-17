import { z } from "zod";

export const TraineeSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(6, "Too short phone number"),
  isTrainer: z.boolean().default(false),
  favorites: z
    .array(
      z.object({
        trainerId: z.string(),
      })
    )
    .default([]),
});
