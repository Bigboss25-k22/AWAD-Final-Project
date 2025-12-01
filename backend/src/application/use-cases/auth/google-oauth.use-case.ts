import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { randomUUID } from 'crypto';

import { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { ITokenService } from '../../ports/token.port';
import { IEncryptionService } from '../../ports/encryption.port';
import { IPasswordService } from '../../ports/password.port';

export class GoogleOAuthUseCase {
  private oauthClient: OAuth2Client;
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly encryptionService: IEncryptionService,
    private readonly passwordService: IPasswordService,
  ) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Missing Google OAuth credentials');
    }
    this.oauthClient = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
  }

  getConsentUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.labels',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    return this.oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  async exchangeCode(code: string) {
    // a. Get token from Google
    const { tokens } = await this.oauthClient.getToken(code);
    this.oauthClient.setCredentials(tokens);

    // b. Get user info
    const oauth2 = google.oauth2({
      version: 'v2',
      auth: this.oauthClient,
    });
    const { data: userInfo } = await oauth2.userinfo.get();

    if (!userInfo.email) {
      throw new Error('Email not found in Google user info');
    }

    // c. Find or create user
    let user = await this.userRepository.findByEmail(userInfo.email);
    if (!user) {
      user = new User();
      user.id = randomUUID();
      user.email = userInfo.email;
      user.name = userInfo.name ?? undefined;
      user.provider = 'google';
      user = await this.userRepository.create(user);
    }

    // d. Save Google tokens (encrypted) to DB
    if (tokens.access_token) {
      user.googleAccessToken = this.encryptionService.encrypt(
        tokens.access_token,
      );
    }
    if (tokens.refresh_token) {
      user.googleRefreshToken = this.encryptionService.encrypt(
        tokens.refresh_token,
      );
    }
    if (tokens.expiry_date) {
      user.googleTokenExpiry = new Date(tokens.expiry_date);
    }

    // e. Generate tokens
    const accessToken = this.tokenService.generateAccessToken(user);
    const refreshToken = this.tokenService.generateRefreshToken(user);

    // f. Hash & Save App Refresh Token to DB (Critical Fix)
    const refreshTokenHash =
      await this.passwordService.hashPassword(refreshToken);
    user.setRefreshToken(refreshTokenHash);

    await this.userRepository.update(user);

    return { accessToken, refreshToken, user };
  }
}
