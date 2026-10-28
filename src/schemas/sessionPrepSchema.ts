import { z } from "zod";

export const sessionPrepFormSchema = z.object({
  prompt: z.string().trim()
    .min(20, "Describe your tutoring needs in at least 20 characters.")
    .max(2000, "Keep your tutoring needs to 2,000 characters or fewer."),
});

export type SessionPrepFormValues = z.infer<typeof sessionPrepFormSchema>;
