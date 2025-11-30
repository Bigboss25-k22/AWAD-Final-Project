import { IUserRepository } from "src/domain/repositories/user.repository";
import { IGmailService } from "src/application/ports/gmail.port";
import { IEncryptionService } from "src/application/ports/encryption.port";

const allowedLabels = [
  'INBOX',
  'SENT',
  'DRAFT',
  'TRASH',
  'SPAM',
  'STARRED',
  'IMPORTANT',
  'UNREAD'
];

export class GetLabelsUseCase {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly gmailService: IGmailService,   
        private readonly encryptionService: IEncryptionService,
    ) {}

    async execute(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.googleAccessToken) {
            throw new Error('User not found or not linked with Google');
        }

        const accessToken = this.encryptionService.decrypt(user.googleAccessToken);

        const labels = await this.gmailService.listLabels(
            accessToken,
            'me',
        );

        const filteredLabels = labels.filter(label => 
            allowedLabels.includes(label.id!)
        );

        return filteredLabels;
    }
}