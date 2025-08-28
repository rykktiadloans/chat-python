export interface Contact {
  messageId: number;
  other: string;
  content: string;
  sentAt: Date;
}

export function contactFromJson(json: any): Contact {
  return {
    messageId: json["message_id"],
    other: json["other"],
    content: json["content"],
    sentAt: new Date(json["sent_at"])
  }
}
