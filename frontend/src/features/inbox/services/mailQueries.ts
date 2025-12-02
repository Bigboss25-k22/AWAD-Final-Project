import { API_PATH } from '@/constants/apis.constant';
import axiosClient from '@/services/apis/apiClient';
import { AxiosResponse } from 'axios';
import { IEmail, IMailbox, IEmailsResponse } from '../interfaces/mailAPI.interface';

// Get list mail boxes
export function getListMailBoxes(): Promise<AxiosResponse<IMailbox[]>> {
  return axiosClient.get<IMailbox[]>(
    API_PATH.EMAIL.GET_LIST_MAILBOXES.API_PATH,
  );
}

// Get list emails by mail box id
export function getListEmailsByMailBoxId(
  id: string,
  page?: number,
  limit?: number,
): Promise<AxiosResponse<IEmailsResponse>> {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const queryString = params.toString();
  const url = queryString 
    ? `${API_PATH.EMAIL.GET_LIST_EMAILS_MAILBOX.API_PATH(id)}?${queryString}`
    : API_PATH.EMAIL.GET_LIST_EMAILS_MAILBOX.API_PATH(id);
    
  return axiosClient.get<IEmailsResponse>(url);
}

// Get email detail by email id
export function getEmailDetailById(id: string): Promise<AxiosResponse<IEmail>> {
  return axiosClient.get<IEmail>(API_PATH.EMAIL.GET_DETAIL_MAIL.API_PATH(id));
}

// Reply email by email id
export function replyEmailById(id: string): Promise<AxiosResponse<void>> {
  return axiosClient.post<void>(API_PATH.EMAIL.REPLY_EMAIL.API_PATH(id));
}

// Send email
export function sendEmail(): Promise<AxiosResponse<void>> {
  return axiosClient.post<void>(API_PATH.EMAIL.SEND_EMAIL.API_PATH);
}

// Modify email by email id
export function modifyEmailById(id: string): Promise<AxiosResponse<void>> {
  return axiosClient.post<void>(API_PATH.EMAIL.MODIFY_EMAIL.API_PATH(id));
}

// Stream attachment by attachment id
export function streamAttachmentById(id: string): Promise<AxiosResponse<void>> {
  return axiosClient.get<void>(API_PATH.EMAIL.ATTACHMENT_DOWNLOAD.API_PATH(id));
}
