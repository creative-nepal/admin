import { z } from "zod";

export const planFormSchema = z.object({
  sector: z.string().min(1, "Required"),
  key: z
    .string()
    .min(1, "Required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase slug, e.g. mart-pro"),
  name: z.string().min(1, "Required").max(255),
  price: z.number().min(0, "Must be zero or more"),
  currency: z.string().min(1).max(3),
  billingCycle: z.enum(["monthly", "yearly"]),
  maxStaff: z.number().int().min(1),
  maxProducts: z.number().int().min(1),
});

export type PlanFormValues = z.infer<typeof planFormSchema>;
