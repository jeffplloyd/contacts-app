import { ListContact, Contact } from "schema";

export type ContactType = Zod.infer<typeof ListContact>;
export type ContactDetailsType = Zod.infer<typeof Contact>;

export const getContacts = async () => {
  const response = await fetch('http://192.168.4.223:3000/contacts/list');
  const data = await response.json();
  const result = ListContact.array().safeParse(data.data);
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return (result.data);
}

export const getContact = async (id: number) => {
  const response = await fetch(`http://192.168.4.223:3000/contacts/${id}`);
  const data = await response.json();
  const result = Contact.safeParse({
    ...data,
    dob: new Date(data.dob),
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at),
  });
  if (!result.success) {
    throw new Error(`Invalid person data: ${result.error}`);
  }
  return (result.data);
}

export const getContactRoles = (contacts: ContactType[]) => {
  const grouped = contacts.reduce((acc: { [key: string]: { contacts: ContactType[], count: number } }, contact) => {
    const role = contact.role || 'Unknown';
    if (!acc[role]) {
      acc[role] = { contacts: [], count: 0 };
    }
    acc[role].contacts.push(contact);
    acc[role].count++;
    return acc;
  }, {});
  return grouped;
}