import {z} from "zod";

export const Contact = z.object({
  fname: z.string().max(50),
  lname: z.string().max(50),
  dob: z.string().nullable().optional(),
  website: z.string().max(100).url().nullable().optional(),
  personal_email: z.string().max(100).email().nullable().optional(),
  personal_phone: z.string().max(20).nullable().optional(),
  work_email: z.string().max(100).email().nullable().optional(),
  work_phone: z.string().max(20).nullable().optional(),
  is_favorite: z.boolean().optional(),
  role_id: z.number().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const ContactWithId = Contact.extend({
  id: z.number(),
});