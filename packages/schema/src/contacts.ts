import { z } from "zod";

export const ListContact = z.object({
  id: z.number().optional(),
  fname: z.string().max(50),
  lname: z.string().max(50),
  is_favorite: z.boolean().optional(),
  role: z.string().max(50).optional(),
});

export const Contact = ListContact.extend({
  dob: z.date().nullish(),
  website: z.string().max(0).or(z.string().url()),
  personal_email: z.string().max(0).or(z.string().email()),
  personal_phone: z.string().max(20).optional(),
  work_email: z.string().max(0).or(z.string().email()),
  work_phone: z.string().max(20).optional(),
  role_id: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
