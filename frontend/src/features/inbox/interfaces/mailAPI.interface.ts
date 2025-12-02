export interface IMailbox {
  id: string;
  name: string;
}

export interface IEmail {
  id: string;
  mailboxId: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead?: boolean;
  isStarred?: boolean;
  hasAttachment?: boolean;
}

export interface IEmailParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
}

export interface IEmailAttachment {
  filename: string;
  content: string; // base64 encoded content
  mimeType: string;
}
export interface ISendMessageParams {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  threadId?: string; // reply within a thread
  replyToMessageId?: string; // reply to a specific message
  attachments?: IEmailAttachment[]; // file attachments
}

export interface ReplyEmailParams {
  to?: string[];
  cc?: string[];
  bcc?: string[];
  body: string;
  includeOriginal?: boolean;
  attachments?: IEmailAttachment[];
}
