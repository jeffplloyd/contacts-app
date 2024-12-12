import {z} from 'zod';

export const Person = z.object({
  name: z.string(),
  age: z.number(),
});

export const PersonWithId = Person.extend({
  id: z.number(),
});