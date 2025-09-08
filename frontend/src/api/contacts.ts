import { contactFromJson, type Contact } from "../model/contact";

export async function fetchContacts(token: string): Promise<Contact[]> {
  try {
    const json = await fetch("/api/v1/users/contacts", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json());
    return json.map((el: any) => contactFromJson(el));
  }
  catch (e: any) {
    console.log(e);
  }
  return [];
}
