export interface Message {
  id: number;
  content: string;
  sentAt: Date;
  senderUsername: string;
  recipientUsername: string;
  attachments: [
    {
      originalName: string;
      storedName: string;
    },
  ];
}

export function messageFromJson(json: any): Message {
  return {
    id: json["id"],
    content: json["content"],
    sentAt: new Date(json["sent_at"]),
    senderUsername: json["sender_username"],
    recipientUsername: json["recipient_username"],
    attachments: json["attachments"].map((attachment: any) => ({
      originalName: attachment["original_name"],
      storedName: attachment["stored_name"],
    })),
  };
}
