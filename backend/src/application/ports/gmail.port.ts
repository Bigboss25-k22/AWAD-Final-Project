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

export interface GmailLabel {
  id: string;
  name: string;
  type: string;
  messageListVisibility?: string;
  labelListVisibility?: string;
  messagesTotal?: number;
  messagesUnread?: number;
}

export interface ListMessagesParams {
  userId?: string;
  labelIds?: string[];
  query?: string;
  maxResults?: number;
  pageToken?: string;
}

export interface ListMessagesResponse {
  messages: GmailMessage[];
  nextPageToken?: string;
  resultSizeEstimate?: number;
}

export interface SendMessageParams {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  threadId?: string;  // reply within a thread
  replyToMessageId?: string;  // reply to a specific message
}

export interface ModifyMessageParams {
  addLabelIds?: string[];
  removeLabelIds?: string[];
}

export abstract class IGmailService {
  abstract getProfile(accessToken: string): Promise<any>;

  abstract listMessages(
    accessToken: string,
    params: ListMessagesParams,
  ): Promise<ListMessagesResponse>;

  abstract getMessage(
    accessToken: string,
    userId: string,
    messageId: string,
  ): Promise<GmailMessage>;

  abstract listLabels(
    accessToken: string,
    userId: string,
  ): Promise<GmailLabel[]>;

  abstract sendMessage(
    accessToken: string,
    params: SendMessageParams,
  ): Promise<GmailMessage>;

  abstract modifyMessage(
    accessToken: string,
    userId: string,
    messageId: string,
    params: ModifyMessageParams,
  ): Promise<GmailMessage>;
}
