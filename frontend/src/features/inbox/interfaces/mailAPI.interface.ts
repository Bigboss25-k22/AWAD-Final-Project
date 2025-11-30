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

export interface ISendEmailPayload {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  attachments?: string[];
}
