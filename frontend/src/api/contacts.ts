import { contactFromJson, type Contact } from "../model/contact";

export async function fetchContacts(token: string): Promise<Contact[]> {
  try {
    const json = await fetch("/api/v1/users/contacts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json());
    return json.map((el: any) => contactFromJson(el));
  } catch (e: any) {
    console.log(e);
  }
  return [];
}

export async function checkIfContactExists(contact: string): Promise<boolean> {
  try {
    const result = await fetch(`/api/v1/users/exists/${contact}`).then((response) =>
      response.json(),
    );
    if (result) {
      return true;
    }
  } catch (e: any) {
    console.log(e);
  }
  return false;
}
