export class User {
  id: string;
  email: string;
  password?: string;
  name?: string;
  provider: 'local' | 'google';
  refreshToken?: string;
  googleAccessToken?: string;
  googleRefreshToken?: string;
  googleTokenExpiry?: Date;
  constructor(params?: Partial<User>) {
    if (params) {
      this.id = params.id!;
      this.email = params.email!;
      this.password = params.password;
      this.name = params.name;
      this.provider = params.provider!;
      this.refreshToken = params.refreshToken;
      this.googleAccessToken = params.googleAccessToken;
      this.googleRefreshToken = params.googleRefreshToken;
      this.googleTokenExpiry = params.googleTokenExpiry;
    }
  }

  setRefreshToken(hash: string) {
    this.refreshToken = hash;
  }

  isGoogleAccount() {
    return this.provider === 'google';
  }
}
