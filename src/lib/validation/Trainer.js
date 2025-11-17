import { z } from "zod";

export const TrainerSchema = z.object({
  email: z.string().email("Invalid email format"),
  trainigTypes: z
    .array(z.string().min(1, "Training type cannot be empty"))
    .min(1, "At least one training type is required"),
  address: z.string().min(2, "Address must be at least 2 characters"),
  trainings: z
    .array(
      z.object({
        trainingId: z.string().min(1, "trainingId cannot be empty"),
      })
    )
    .default([]),
  comments: z
    .array(
      z.object({
        traineeName: z.string().min(2, "Trainee name must be at least 2 characters"),
        comment: z.string().min(1, "Comment cannot be empty"),
      })
    )
    .default([]),
});
