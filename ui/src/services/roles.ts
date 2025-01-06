import { Role } from "schema";
import { z } from "zod";

export type RoleType = z.infer<typeof Role>;

export const getRoles = async () => {
  const response = await fetch("http://192.168.4.223:3000/roles");
  const data = await response.json();
  const result = Role.array().safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return result.data;
};
