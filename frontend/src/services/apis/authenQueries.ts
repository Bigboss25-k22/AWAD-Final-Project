import { AxiosResponse } from 'axios';
import axiosClient from './apiClient';
import { API_PATH } from '@/constants/apis.constant';

export function logoutUser(): Promise<AxiosResponse<void>> {
  return axiosClient.post<void>(API_PATH.AUTHENTICATE.LOGOUT.API_PATH);
}
