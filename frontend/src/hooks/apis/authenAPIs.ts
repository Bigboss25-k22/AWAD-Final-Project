import { API_PATH } from '@/constants/apis.constant';
import { UseMutationLoginOptions } from '@/interfaces/query';
import { logoutUser } from '@/services/apis/authenQueries';
import { useMutation } from '@tanstack/react-query';

export const useMutationLogout = ({
  onSuccess,
  onError,
}: UseMutationLoginOptions) => {
  return useMutation({
    mutationKey: [API_PATH.AUTHENTICATE.LOGOUT.API_KEY],
    mutationFn: () => logoutUser(),
    onSuccess,
    onError,
  });
};
