import { API_PATH } from '@/constants/apis.constant';
import axiosClient from '@/services/api/apiClient';
import { AxiosResponse } from 'axios';
import { IRegisterParams } from '../interfaces/register.interface';

export function registerUser(
  params: IRegisterParams,
): Promise<AxiosResponse<void>> {
  return axiosClient.post<void>(
    API_PATH.AUTHENTICATE.REGISTER.API_PATH,
    params,
  );
}
