import { API_PATH } from '@/constants/apis.constant';
import { UseMutationLoginOptions } from '@/interfaces/query';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../services/registerQueries';

export const useMutationRegister = ({
  onSuccess,
  onError,
}: UseMutationLoginOptions) => {
  return useMutation({
    mutationKey: [API_PATH.AUTHENTICATE.REGISTER.API_KEY],
    mutationFn: registerUser,
    onSuccess,
    onError,
  });
};
