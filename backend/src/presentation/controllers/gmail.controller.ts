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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetLabelsUseCase } from '../../application/use-cases/gmail/get-labels.use-case';
import { GetEmailsUseCase } from '../../application/use-cases/gmail/get-emails.use-case';
import { GetEmailDetailUseCase } from '../../application/use-cases/gmail/get-email-detail.use-case';
import { SendEmailUseCase } from '../../application/use-cases/gmail/send-email.use-case';
import { ReplyEmailUseCase } from '../../application/use-cases/gmail/reply-email.use-case';
import { SendEmailDto } from '../dtos/request/send-email.dto';
import { ReplyEmailDto } from '../dtos/request/reply-email.dto';

@ApiTags('Mail')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mail')
export class GmailController {
  constructor(
    private readonly getLabelsUseCase: GetLabelsUseCase,
    private readonly getEmailsUseCase: GetEmailsUseCase,
    private readonly getEmailDetailUseCase: GetEmailDetailUseCase,
    private readonly sendEmailUseCase: SendEmailUseCase,
    private readonly replyEmailUseCase: ReplyEmailUseCase,
  ) {}

  @Get('mailboxes')
  @ApiOperation({ summary: 'Get list of mailboxes (labels)' })
  @ApiResponse({ status: 200, description: 'List of mailboxes returned' })
  async getMailboxes(@Req() req: any) {
    return await this.getLabelsUseCase.execute(req.user.sub);
  }

  @Get('emails/:id')
  @ApiOperation({ summary: 'Get email detail by ID' })
  @ApiResponse({ status: 200, description: 'Email detail returned' })
  async getEmailDetail(@Req() req: any, @Param('id') id: string) {
    return await this.getEmailDetailUseCase.execute(req.user.sub, id);
  }

  @Get('mailboxes/:mailboxId/emails')
  @ApiOperation({ summary: 'Get emails from a mailbox' })
  @ApiResponse({ status: 200, description: 'List of emails returned' })
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
  @ApiOperation({ summary: 'Send a new email' })
  @ApiResponse({ status: 201, description: 'Email sent successfully' })
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
  @ApiOperation({ summary: 'Reply to an email' })
  @ApiResponse({ status: 201, description: 'Reply sent successfully' })
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
}

