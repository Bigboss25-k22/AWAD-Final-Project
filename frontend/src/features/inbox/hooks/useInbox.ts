import { App } from 'antd';
import {
  useGetAttachmentById,
  useGetEmailDetailById,
  useGetEmailsByMailBoxId,
  useGetMailBoxes,
  useMutationModifyEmailById,
  useMutationReplyEmailById,
} from './mailAPIs';

interface InBoxProps {
  mailBoxID: string;
  mailID: string;
}

export const useInbox = ({ mailBoxID, mailID }: InBoxProps) => {
  const { notification } = App.useApp();

  const { data: mailboxes, isLoading: isMailboxesLoading } = useGetMailBoxes();

  const { data: emails, isLoading: isEmailsLoading } =
    useGetEmailsByMailBoxId(mailBoxID);

  const { data: emailDetail, isLoading: isEmailDetailLoading } =
    useGetEmailDetailById(mailID);

  const { mutateAsync: replyEmail, isPending: isReplyEmailPending } =
    useMutationReplyEmailById({
      onSuccess: () => {
        notification.success({
          message: 'Reply Email Success',
          description: 'Your reply has been sent successfully.',
        });
      },
      onError: (error) => {
        console.error('Reply Email Failed:', error);
      },
    });

  const { mutateAsync: modifyEmail, isPending: isModifyEmailPending } =
    useMutationModifyEmailById({
      onSuccess: () => {
        notification.success({
          message: 'Modify Email Success',
          description: 'The email has been modified successfully.',
        });
      },
      onError: (error) => {
        console.error('Modify Email Failed:', error);
      },
    });

  const { data: streamAttachment, isLoading: isStreamAttachmentLoading } =
    useGetAttachmentById(mailID);

  return {
    mailboxes,
    isMailboxesLoading,
    emails,
    isEmailsLoading,
    emailDetail,
    isEmailDetailLoading,
    replyEmail,
    isReplyEmailPending,
    modifyEmail,
    isModifyEmailPending,
    streamAttachment,
    isStreamAttachmentLoading,
  };
};
