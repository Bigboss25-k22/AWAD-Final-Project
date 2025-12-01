import { AuthController } from './auth.controller';
// import { EmailController } from './email.controller'; // Comment hoặc xóa dòng này
import { GmailController } from './gmail.controller';

// Chỉ export AuthController và GmailController (đã đổi route thành /mail)
export const Controllers = [AuthController, GmailController];
