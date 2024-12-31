import { z } from "zod";

export const Role = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
