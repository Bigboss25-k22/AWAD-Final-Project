import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IGmailService, SendMessageParams } from '../../ports/gmail.port';
import { IEncryptionService } from '../../ports/encryption.port';

export interface SendEmailParams {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
}

export class SendEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly gmailService: IGmailService,
    private readonly encryptionService: IEncryptionService,
  ) {}

  async execute(userId: string, params: SendEmailParams) {

    const user = await this.userRepository.findById(userId);
    if (!user || !user.googleAccessToken) {
      throw new Error('User not found or not linked with Google');
    }

    const accessToken = this.encryptionService.decrypt(user.googleAccessToken);

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