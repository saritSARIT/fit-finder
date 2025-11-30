import { z } from "zod";

export const TrainingSchema = z.object({
  day: z.number(),

  from: z.string().min(1, "Start time is required"),
  to: z.string().min(1, "End time is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
  type: z.string(),
  classType: z.enum(["personal", "group"], "classType must be 'personal' or 'group'"),
  status: z.enum(["empty", "sent", "approved", "rejected"], "status must be 'sent', 'approved' or 'rejected'"),

  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format")
    .optional(),
  trainees: z
    .array(
      z.object({
        id: z.string().min(1, "Trainee ID cannot be empty"),
        notes: z.array(z.string()).optional(),
      })
    )
    .optional(),
});