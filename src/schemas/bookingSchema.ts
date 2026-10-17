import { z } from "zod";

export const bookingSchema = z.object({
  sessionId: z.string().min(1, "Choose a tutoring session before booking."),
  note: z
    .string()
    .max(160, "Keep the learning note to 160 characters or fewer.")
    .refine(
      (value) => value === "" || value.trim().length >= 10,
      "If you add a learning note, use at least 10 non-space characters.",
    ),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
