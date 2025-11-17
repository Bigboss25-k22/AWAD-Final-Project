import { useAppDispatch } from '@/redux/hooks';
import { setAccessToken } from '@/redux/slices/authSlice';
import { App, Form } from 'antd';
import { useRouter } from 'next/navigation';
import { LoginFormValues } from '../interfaces';
import { useMutationLogin } from './loginAPI';

export const useLogin = () => {
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mutateAsync: login, isPending: isLoading } = useMutationLogin({
    onSuccess: () => {
      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in.',
      });
    },
    onError: (error) => {
      notification.error({
        message: 'Login Failed',
        description:
          (error as Error).message || 'An error occurred during login.',
      });
    },
  });

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await login(values);
      // localStorage.setItem('accessToken', response?.data?.accessToken);
      dispatch(setAccessToken(response?.data?.accessToken));
      // localStorage.setItem('refreshToken', response?.data?.refreshToken);
      // document.cookie = `refreshToken=${response?.data?.refreshToken}; path=/; secure; samesite=strict`;
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      router.push('/');
    }
  };

  return { form, onFinish, isLoading };
};
