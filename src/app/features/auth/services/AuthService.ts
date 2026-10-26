import { Professional } from '../../../shared';

export type LoginCredentials = {
  email: string;
  password?: string;
};

export class AuthService {
  async login(credentials: LoginCredentials): Promise<Professional> {
    // Demonstration/offline-first login without hardcoded secrets
    return {
      id: 'prof_01',
      name: 'Dr. Roberto Silva',
      email: credentials.email,
      professionalCategory: 'Fisioterapeuta',
      professionalRegistration: 'CREFITO 12345-F',
    };
  }

  async logout(): Promise<void> {
    // Cleanup any local tokens if needed
  }
}

export const defaultAuthService = new AuthService();
