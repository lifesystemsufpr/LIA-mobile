import { useCallback, useState } from 'react';
import { useSessionStore } from '../../../shared';
import { defaultAuthService, LoginCredentials } from '../services/AuthService';

export function useAuth() {
  const { professional, isAuthenticated, login, logout } = useSessionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        setLoading(true);
        setError(null);
        const prof = await defaultAuthService.login(credentials);
        login(prof);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return {
    professional,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    logout,
  };
}
