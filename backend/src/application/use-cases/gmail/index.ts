import { GetMailboxesUseCase } from './get-mailboxes.use-case';
import { GetEmailsUseCase } from './get-emails.use-case';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { IGmailService } from '../../ports/gmail.port';
import { IEncryptionService } from '../../ports/encryption.port';

export const GmailUseCaseProviders = [
  {
    provide: GetMailboxesUseCase,
    useFactory: (
      userRepo: IUserRepository,
      gmailService: IGmailService,
      encryptionService: IEncryptionService,
    ) => new GetMailboxesUseCase(userRepo, gmailService, encryptionService),
    inject: [IUserRepository, IGmailService, IEncryptionService],
  },
  {
    provide: GetEmailsUseCase,
    useFactory: (
      userRepo: IUserRepository,
      gmailService: IGmailService,
      encryptionService: IEncryptionService,
    ) => new GetEmailsUseCase(userRepo, gmailService, encryptionService),
    inject: [IUserRepository, IGmailService, IEncryptionService],
  },
];

export const GmailUseCases = [GetMailboxesUseCase, GetEmailsUseCase];
