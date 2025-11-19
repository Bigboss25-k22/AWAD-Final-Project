import {
  useGetEmailDetailById,
  useGetEmailsByMailBoxId,
  useGetMailBoxes,
} from './mailAPI';

interface InBoxProps {
  mailBoxID: string;
  mailID: string;
}

export const useInbox = (props: InBoxProps) => {
  const { data: mailboxes, isLoading: isMailboxesLoading } = useGetMailBoxes();
  const { data: emails, isLoading: isEmailsLoading } = useGetEmailsByMailBoxId(
    props.mailBoxID,
  );
  const { data: emailDetail, isLoading: isEmailDetailLoading } =
    useGetEmailDetailById(props.mailID);
  return {
    mailboxes,
    isMailboxesLoading,
    emails,
    isEmailsLoading,
    emailDetail,
    isEmailDetailLoading,
  };
};
