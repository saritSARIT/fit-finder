import { z } from "zod";

export const TrainingSchema = z.object({
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  trainerId: z.string().min(1, "Trainer ID is required"),
  traineeId: z
    .array(z.string().min(1, "Trainee ID cannot be empty"))
    .min(1, "At least one trainee is required"),
  type: z.string().min(1, "Type is required"),
  address: z.string().min(2, "Address must be at least 2 characters"),
  classType: z.enum(["personal", "group"], "classType must be 'personal' or 'group'"),
  status: z.enum(["sent", "approved", "rejected"], "status must be 'sent', 'approved' or 'rejected'"),
});
