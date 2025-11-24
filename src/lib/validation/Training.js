import { z } from "zod";

export const ActiveTrainingSchema = z.object({
  status: z.enum(["sent", "approved", "rejected"], "status must be 'sent', 'approved' or 'rejected'"),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  traineeId: z
    .array(z.string().min(1, "Trainee ID cannot be empty"))
    .min(1, "At least one trainee is required"),


  from: z.string().min(1, "Start time is required"),
  to: z.string().min(1, "End time is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
  type: z.string().min(1, "Type is required"),
  classType: z.enum(["personal", "group"], "classType must be 'personal' or 'group'"),

});

export const TrainingSchema = z.object({
  day: z.number(),

  from: z.string().min(1, "Start time is required"),
  to: z.string().min(1, "End time is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
  type: z.string().min(1, "Type is required").optional(),
  classType: z.enum(["personal", "group"], "classType must be 'personal' or 'group'"),
});