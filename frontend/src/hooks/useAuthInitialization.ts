import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials, selectAccessToken } from '@/redux/slices/authSlice';
import apiClient from '@/services/apis/apiClient';
import { App } from 'antd';

/**
 * Hook to initialize auth state when user returns with refreshToken cookie
 * Calls refresh-token endpoint to restore Redux state
 */
export const useAuthInitialization = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  const { message } = App.useApp();
  const initializedRef = useRef(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Skip if already initialized or if already has token
    if (initializedRef.current || accessToken) {
      return;
    }

    initializedRef.current = true;
    setIsInitializing(true);

    const initializeAuth = async () => {
      try {
        // Call refresh-token endpoint (uses httpOnly cookie automatically)
        const response = await apiClient.post('/auth/refresh-token');
        const { accessToken: newAccessToken } = response.data;

        // Get user info from token payload (JWT decode)
        const payload = JSON.parse(atob(newAccessToken.split('.')[1]));
        const user = {
          id: payload.sub,
          email: payload.email,
        };

        // Update Redux state
        dispatch(setCredentials({ accessToken: newAccessToken, user }));

        // Redirect to inbox
        router.push('/inbox');
      } catch (error) {
        // No valid refresh token - user needs to login
        console.log('No valid session, redirecting to login');
        router.push('/login');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [accessToken, dispatch, router, message]);

  return { isInitializing };
};
