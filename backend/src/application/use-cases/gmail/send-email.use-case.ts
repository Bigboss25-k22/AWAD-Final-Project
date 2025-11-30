import { IGmailService, SendMessageParams } from '../../ports/gmail.port';
import { BaseGmailUseCase } from './base-gmail.use-case';

export interface SendEmailParams {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
}

export class SendEmailUseCase extends BaseGmailUseCase {
  async execute(userId: string, params: SendEmailParams) {
    const accessToken = await this.getAccessToken(userId);

    const sendParams: SendMessageParams = {
      to: params.to,
      subject: params.subject,
      body: params.body,
      cc: params.cc,
      bcc: params.bcc,
    };

    const result = await this.gmailService.sendMessage(accessToken, sendParams);

    return {
      success: true,
      messageId: result.id,
      threadId: result.threadId,
    };
  }
}