import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import {
  IGmailService,
  GmailMessage,
  GmailLabel,
  ListMessagesParams,
  ListMessagesResponse,
  SendMessageParams,
} from '../../application/ports/gmail.port';

@Injectable()
export class GmailServiceImpl implements IGmailService {
  private getClient(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    return google.gmail({ version: 'v1', auth: oauth2Client });
  }

  async getProfile(accessToken: string): Promise<any> {
    const gmail = this.getClient(accessToken);
    const res = await gmail.users.getProfile({ userId: 'me' });
    return res.data;
  }

  async listMessages(
    accessToken: string,
    params: ListMessagesParams,
  ): Promise<ListMessagesResponse> {
    const gmail = this.getClient(accessToken);
    const userId = params.userId || 'me';

    // 1. Lấy danh sách ID messages với pagination
    const res = await gmail.users.messages.list({
      userId,
      labelIds: params.labelIds,
      q: params.query,
      maxResults: params.maxResults || 20,
      pageToken: params.pageToken, // Token cho trang tiếp theo
    });

    const messages = res.data.messages || [];
    
    // 2. Lấy chi tiết từng message song song
    const details = messages.length > 0 
      ? await Promise.all(
          messages.map((msg) => this.getMessage(accessToken, userId, msg.id!)),
        )
      : [];

    return {
      messages: details,
      nextPageToken: res.data.nextPageToken ?? undefined,
      resultSizeEstimate: res.data.resultSizeEstimate ?? undefined,
    };
  }

  async getMessage(
    accessToken: string,
    userId: string = 'me',
    messageId: string,
  ): Promise<GmailMessage> {
    const gmail = this.getClient(accessToken);
    const res = await gmail.users.messages.get({
      userId,
      id: messageId,
      format: 'full', 
    });

    return res.data as unknown as GmailMessage;
  }

  async listLabels(
    accessToken: string,
    userId: string = 'me',
  ): Promise<GmailLabel[]> {
    const gmail = this.getClient(accessToken);
    
    const res = await gmail.users.labels.list({ 
      userId 
    });
    
    return (res.data.labels || []) as GmailLabel[];
  }

  async sendMessage(
    accessToken: string,
    params: SendMessageParams,
  ): Promise<GmailMessage> {
    const gmail = this.getClient(accessToken);

    // Tạo email theo RFC 2822 format
    const email = this.createEmailMessage(params);

    // Encode base64url
    const encodedMessage = Buffer.from(email)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const requestBody: any = {
      raw: encodedMessage,
    };

    // Nếu là reply, thêm threadId
    if (params.threadId) {
      requestBody.threadId = params.threadId;
    }

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody,
    });

    return res.data as unknown as GmailMessage;
  }

  private createEmailMessage(params: SendMessageParams): string {
    const lines: string[] = [];

    // Headers
    lines.push(`To: ${params.to.join(', ')}`);
    
    if (params.cc?.length) {
      lines.push(`Cc: ${params.cc.join(', ')}`);
    }
    
    if (params.bcc?.length) {
      lines.push(`Bcc: ${params.bcc.join(', ')}`);
    }
    
    lines.push(`Subject: ${params.subject}`);
    
    // Nếu là reply, thêm header In-Reply-To và References
    if (params.replyToMessageId) {
      lines.push(`In-Reply-To: <${params.replyToMessageId}>`);
      lines.push(`References: <${params.replyToMessageId}>`);
    }
    
    lines.push('MIME-Version: 1.0');
    lines.push('Content-Type: text/html; charset=UTF-8');
    lines.push('');
    lines.push(params.body);

    return lines.join('\r\n');
  }
}