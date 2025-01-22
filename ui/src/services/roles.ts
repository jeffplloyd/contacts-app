import { Role } from "schema";
import { z } from "zod";

export type RoleType = z.infer<typeof Role>;

const apiUri = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getRoles = async () => {
  const response = await fetch(`${apiUri}/roles`);
  const data = await response.json();
  const result = Role.array().safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return result.data;
};
