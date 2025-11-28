import { AxiosResponse } from 'axios';
import axiosClient from '@/services/apis/apiClient';
import { API_PATH } from '@/constants/apis.constant';
import { ILoginParams, ILoginResponse } from '../interfaces/login.interface';

export function loginUser(
  params: ILoginParams,
): Promise<AxiosResponse<ILoginResponse>> {
  return axiosClient.post<ILoginResponse>(
    API_PATH.AUTHENTICATE.LOGIN.API_PATH,
    params,
  );
}

export function loginWithGoogle(
  idToken: string,
): Promise<AxiosResponse<ILoginResponse>> {
  return axiosClient.post<ILoginResponse>(
    API_PATH.AUTHENTICATE.GOOGLE_LOGIN.API_PATH,
    { idToken },
  );
}
