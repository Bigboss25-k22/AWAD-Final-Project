export interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload?: {
    headers: { name: string; value: string }[];
    body?: { data?: string };
  };
  internalDate: string;
  labelIds: string[];
}

export interface GmailThread {
  id: string;
  snippet: string;
  messages: GmailMessage[];
}

export abstract class IGmailService {
  abstract getProfile(accessToken: string): Promise<any>;

  abstract listMessages(
    accessToken: string,
    userId: string,
    query?: string,
    maxResults?: number,
  ): Promise<GmailMessage[]>;

  abstract getMessage(
    accessToken: string,
    userId: string,
    messageId: string,
  ): Promise<GmailMessage>;
}
