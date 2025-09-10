import { messageFromJson, type Message } from "../model/message";

export async function fetchMessagePage(
  other: string,
  page: number,
  offset: number,
  token: string,
): Promise<Message[]> {
  try {
    const json = await fetch(
      `/api/v1/messages?recipient_username=${other}&other&page=${page}&size=20&offset=${offset}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => response.json());
    const messages = json.map((el: any) => messageFromJson(el));
    return messages;
  } catch (e: any) {
    console.log(e);
  }
  return [];
}

export async function sendMessage(
  other: string,
  content: string,
  attachments: FileList | null,
  token: string,
): Promise<void> {
  const form = new FormData();
  form.append("content", content);
  form.append("recipient_username", other);
  if (attachments !== null) {
    for (let attachment of attachments) {
      form.append("attachments", attachment);
    }
  }
  try {
    await fetch(`/api/v1/messages/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    }).then((response) => response.json());
  } catch (e: any) {
    console.log(e);
  }
}

export async function patchMessage(id: number, content: string, token: string): Promise<void> {
  try {
    await fetch(`/api/v1/messages/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        content: content,
      }),
    }).then((response) => response.json());
  } catch (e: any) {
    console.log(e);
  }
  return;
}

export async function deleteMessage(id: number, token: string): Promise<void> {
  try {
    await fetch(`/api/v1/messages/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json());
  } catch (e: any) {
    console.log(e);
  }
  return;
}
