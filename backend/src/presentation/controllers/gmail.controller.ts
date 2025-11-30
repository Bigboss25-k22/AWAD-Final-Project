import { Controller, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetMailboxesUseCase } from '../../application/use-cases/gmail/get-mailboxes.use-case';
import { GetEmailsUseCase } from '../../application/use-cases/gmail/get-emails.use-case';

@ApiTags('Mail')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mail')
export class GmailController {
  constructor(
    private readonly getMailboxesUseCase: GetMailboxesUseCase,
    private readonly getEmailsUseCase: GetEmailsUseCase,
  ) {}

  @Get('mailboxes')
  @ApiOperation({ summary: 'Get list of mailboxes (labels)' })
  @ApiResponse({ status: 200, description: 'List of mailboxes returned' })
  async getMailboxes(@Req() req: any) {
    return await this.getMailboxesUseCase.execute(req.user.sub);
  }

  @Get('mailboxes/:mailboxId/emails')
  @ApiOperation({ summary: 'Get emails from a mailbox' })
  @ApiResponse({ status: 200, description: 'List of emails returned' })
  async getEmails(@Req() req: any, @Param('mailboxId') mailboxId: string) {
    const mbId = mailboxId || 'inbox';
    return await this.getEmailsUseCase.execute(req.user.sub, mbId);
  }
}
