import { ListContact, Contact } from "schema";

export type ContactType = Zod.infer<typeof ListContact>;
export type ContactDetailsType = Zod.infer<typeof Contact>;

const apiUri = "http://192.168.4.223:3000";

export const getContacts = async () => {
  const response = await fetch(`${apiUri}/contacts/list`);
  const data = await response.json();
  const result = ListContact.array().safeParse(data.data);
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return result.data;
};

export const getContact = async (id: number) => {
  const response = await fetch(`${apiUri}/contacts/${id}`);
  if (response.status === 404) {
    throw new Error("Contact not found");
  }
  const data = await response.json();
  const result = Contact.safeParse({
    ...data,
    dob: data.dob ? new Date(data.dob) : null,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  });
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return result.data;
};

export const getContactRoles = (contacts: ContactType[]) => {
  const grouped = contacts.reduce((acc: { [key: string]: { contacts: ContactType[]; count: number } }, contact) => {
    const role = contact.role || "Unknown";
    if (!acc[role]) {
      acc[role] = { contacts: [], count: 0 };
    }
    acc[role].contacts.push(contact);
    acc[role].count++;
    return acc;
  }, {});
  return grouped;
};

export const updateFavorite = async (id: number) => {
  const response = await fetch(`${apiUri}/contacts/favorite/${id}`, {
    method: "PUT",
  });
  const data = await response.json();
  const result = ListContact.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return result.data;
};

export const deleteContact = async (id: number) => {
  const response = await fetch(`${apiUri}/contacts/${id}`, {
    method: "DELETE",
  });
  if (response.status === 404) {
    throw new Error("Contact not found");
  }
  const data = await response.json();
  const result = Contact.safeParse({
    ...data,
    dob: data.dob ? new Date(data.dob) : null,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  });
  if (!result.success) {
    console.error(`Invalid person data: ${result.error}`);
  }
  return result.data;
};

export const createContact = async (contact: ContactDetailsType) => {
  const validate = Contact.safeParse(contact);
  if (!validate.success) {
    throw new Error(`Invalid person data: ${validate.error}`);
  }
  const response = await fetch(`${apiUri}/contacts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
  });
  const data = await response.json();
  const result = Contact.safeParse({
    ...data,
    dob: data.dob ? new Date(data.dob) : null,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  });
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return result.data;
};
