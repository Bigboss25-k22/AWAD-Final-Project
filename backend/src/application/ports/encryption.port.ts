export abstract class IEncryptionService {
  abstract encrypt(text: string): string;
  abstract decrypt(cipherText: string): string;
}
