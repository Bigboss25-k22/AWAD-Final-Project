import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AuthUseCaseProviders } from './use-cases/auth';
import { EmailUseCaseProviders } from './use-cases/email';
import { GmailUseCaseProviders } from './use-cases/gmail';

@Module({
  imports: [InfrastructureModule],
  providers: [
    ...AuthUseCaseProviders,
    ...EmailUseCaseProviders,
    ...GmailUseCaseProviders,
  ],
  exports: [
    ...AuthUseCaseProviders.map((p) => p.provide),
    ...EmailUseCaseProviders.map((p) => p.provide),
    ...GmailUseCaseProviders.map((p) => p.provide),
  ],
})
export class ApplicationModule {}
