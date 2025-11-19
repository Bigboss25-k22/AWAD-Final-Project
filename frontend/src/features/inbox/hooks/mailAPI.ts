import { API_PATH } from '@/constants/apis.constant';
import { useQuery } from '@tanstack/react-query';
import {
  getEmailDetailById,
  getListEmailsByMailBoxId,
  getListMailBoxes,
} from '../services/mailQuery';

// Hook to get list of mail boxes
export const useGetMailBoxes = () => {
  return useQuery({
    queryKey: [API_PATH.EMAIL.GET_LIST_MAILBOXES.API_KEY],
    queryFn: getListMailBoxes,
    select: (response) => response.data,
  });
};

// Hook to get list of emails by mail box id
export const useGetEmailsByMailBoxId = (id: string) => {
  return useQuery({
    queryKey: [API_PATH.EMAIL.GET_LIST_EMAILS_MAILBOX.API_KEY, id],
    queryFn: () => getListEmailsByMailBoxId(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Hook to get email detail by email id
export const useGetEmailDetailById = (id: string) => {
  return useQuery({
    queryKey: [API_PATH.EMAIL.GET_DETAIL_MAIL.API_KEY, id],
    queryFn: () => getEmailDetailById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};
