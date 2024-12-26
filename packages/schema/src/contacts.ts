import {z} from "zod";

export const ListContact = z.object({
  id: z.number().optional(),
  fname: z.string().max(50),
  lname: z.string().max(50),
  is_favorite: z.boolean().optional(),
  role: z.string().max(50).optional(),
});

export const Contact = ListContact.extend({
  dob: z.date().nullable().optional(),
  website: z.string().max(100).url().nullable().optional(),
  personal_email: z.string().max(100).email().nullable().optional(),
  personal_phone: z.string().max(20).nullable().optional(),
  work_email: z.string().max(100).email().nullable().optional(),
  work_phone: z.string().max(20).nullable().optional(),
  role_id: z.number().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});