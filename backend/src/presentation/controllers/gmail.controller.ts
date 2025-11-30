import { 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
  UseGuards, 
  Req, 
  Body 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import {
  ApiGetMailboxes,
  ApiGetEmailDetail,
  ApiGetEmails,
  ApiSendEmail,
  ApiReplyEmail,
  ApiModifyEmail,
} from '../decorators/swagger/mail.swagger.decorator';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetLabelsUseCase } from '../../application/use-cases/gmail/get-labels.use-case';
import { GetEmailsUseCase } from '../../application/use-cases/gmail/get-emails.use-case';
import { GetEmailDetailUseCase } from '../../application/use-cases/gmail/get-email-detail.use-case';
import { SendEmailUseCase } from '../../application/use-cases/gmail/send-email.use-case';
import { ReplyEmailUseCase } from '../../application/use-cases/gmail/reply-email.use-case';
import { ModifyEmailUseCase } from '../../application/use-cases/gmail/modify-email.use-case';
import { SendEmailDto } from '../dtos/request/send-email.dto';
import { ReplyEmailDto } from '../dtos/request/reply-email.dto';
import { ModifyEmailDto } from '../dtos/request/modify-email.dto';

@ApiTags('Mail')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('mail')
export class GmailController {
  constructor(
    private readonly getLabelsUseCase: GetLabelsUseCase,
    private readonly getEmailsUseCase: GetEmailsUseCase,
    private readonly getEmailDetailUseCase: GetEmailDetailUseCase,
    private readonly sendEmailUseCase: SendEmailUseCase,
    private readonly replyEmailUseCase: ReplyEmailUseCase,
    private readonly modifyEmailUseCase: ModifyEmailUseCase,
  ) {}

  @Get('mailboxes')
  @ApiGetMailboxes()
  async getMailboxes(@Req() req: any) {
    return await this.getLabelsUseCase.execute(req.user.sub);
  }

  @Get('emails/:id')
  @ApiGetEmailDetail()
  async getEmailDetail(@Req() req: any, @Param('id') id: string) {
    return await this.getEmailDetailUseCase.execute(req.user.sub, id);
  }

  @Get('mailboxes/:mailboxId/emails')
  @ApiGetEmails()
  async getEmails(
    @Req() req: any, 
    @Param('mailboxId') mailboxId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const mbId = mailboxId || 'inbox';
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    
    return await this.getEmailsUseCase.execute(
      req.user.sub, 
      mbId,
      pageNum,
      limitNum,
    );
  }

  @Post('emails/send')
  @ApiSendEmail()
  async sendEmail(@Req() req: any, @Body() dto: SendEmailDto) {
    return await this.sendEmailUseCase.execute(req.user.sub, {
      to: dto.to,
      subject: dto.subject,
      body: dto.body,
      cc: dto.cc,
      bcc: dto.bcc,
    });
  }

  @Post('emails/:id/reply')
  @ApiReplyEmail()
  async replyEmail(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ReplyEmailDto,
  ) {
    return await this.replyEmailUseCase.execute(req.user.sub, id, {
      body: dto.body,
      includeOriginal: dto.includeOriginal ?? true,
    });
  }

  @Post('emails/:id/modify')
  @ApiModifyEmail()
  async modifyEmail(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: ModifyEmailDto,
  ) {
    return await this.modifyEmailUseCase.execute(req.user.sub, id, {
      action: dto.action,
      addLabelIds: dto.addLabelIds,
      removeLabelIds: dto.removeLabelIds,
    });
  }
}

