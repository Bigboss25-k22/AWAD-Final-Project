// src/presentation/dtos/request/reply-email.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReplyEmailDto {
  @ApiProperty({ 
    description: 'Reply body (HTML supported)',
    example: '<p>Thanks for your email. I will check and get back to you.</p>'
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ 
    description: 'Include original message in reply',
    required: false,
    default: true
  })
  @IsOptional()
  includeOriginal?: boolean;
}