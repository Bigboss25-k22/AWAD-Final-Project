import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ 
    description: 'Recipient email addresses',
    example: ['recipient@example.com']
  })
  @IsArray()
  @IsEmail({}, { each: true })
  @IsNotEmpty()
  to: string[];

  @ApiProperty({ 
    description: 'Email subject',
    example: 'Meeting Tomorrow'
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ 
    description: 'Email body (HTML supported)',
    example: '<p>Hi, let\'s meet tomorrow at 10am.</p>'
  })
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ 
    description: 'CC recipients',
    required: false,
    example: ['cc@example.com']
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  cc?: string[];

  @ApiProperty({ 
    description: 'BCC recipients',
    required: false,
    example: ['bcc@example.com']
  })
  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  bcc?: string[];
}