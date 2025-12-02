import { LIMIT_DEFAULT, PAGE_DEFAULT } from '@/constants/common.constant';
import { PARAMS_URL } from '@/constants/params.constant';
import { useControlParams } from '@/hooks/useControlParams';
import { App } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { IEmail } from '../interfaces/mailAPI.interface';
import {
  useGetEmailDetailById,
  useGetEmailsByMailBoxId,
  useGetMailBoxes,
  useMutationModifyEmailById,
  useMutationReplyEmailById,
} from './mailAPIs';

interface InBoxProps {
  mailBoxID?: string;
  mailID?: string;
  isMobile: boolean;
}

export const useInbox = ({ mailBoxID, mailID, isMobile }: InBoxProps) => {
  const { searchParams } = useControlParams();
  const { notification } = App.useApp();

  // State management
  const [checkedEmails, setCheckedEmails] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMailbox, setSelectedMailbox] = useState(mailBoxID || 'inbox');
  const [selectedEmail, setSelectedEmail] = useState<string | null>(
    mailID || null,
  );
  const [searchText, setSearchText] = useState('');
  const [showEmailList, setShowEmailList] = useState(true);
  const [showEmailDetail, setShowEmailDetail] = useState(false);

  const pPage = searchParams.get(PARAMS_URL.PAGE) || PAGE_DEFAULT;
  const pLimit = searchParams.get(PARAMS_URL.LIMIT) || LIMIT_DEFAULT;

  const { data: mailboxes, isLoading: isMailboxesLoading } = useGetMailBoxes();

  const { data: emails, isLoading: isEmailsLoading } = useGetEmailsByMailBoxId(
    { page: Number(pPage), limit: Number(pLimit) },
    selectedMailbox,
  );

  // const mailboxes = MOCK_MAILBOXES;
  // const emails = MOCK_EMAILS;

  const { data: emailDetail, isLoading: isEmailDetailLoading } =
    useGetEmailDetailById(selectedEmail || '');

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

  // const { data: streamAttachment, isLoading: isStreamAttachmentLoading } =
  //   useGetAttachmentById(selectedEmail || '');

  const handleCheckboxChange = useCallback(
    (emailId: string, checked: boolean) => {
      setCheckedEmails((prevCheckedEmails) => {
        const newCheckedEmails = new Set(prevCheckedEmails);
        if (checked) {
          newCheckedEmails.add(emailId);
        } else {
          newCheckedEmails.delete(emailId);
        }
        return newCheckedEmails;
      });
    },
    [],
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked && emails) {
        const filteredEmailIds = emails
          .filter(
            (email: IEmail) =>
              email.mailboxId === selectedMailbox &&
              (email.subject.toLowerCase().includes(searchText.toLowerCase()) ||
                email.sender.toLowerCase().includes(searchText.toLowerCase()) ||
                email.preview.toLowerCase().includes(searchText.toLowerCase())),
          )
          .map((email: IEmail) => email.id);
        setCheckedEmails(new Set(filteredEmailIds));
      } else {
        setCheckedEmails(new Set());
      }
    },
    [emails, selectedMailbox, searchText],
  );

  const handleEmailClick = useCallback(
    (emailId: string) => {
      setSelectedEmail(emailId);
      if (isMobile) {
        setShowEmailList(false);
        setShowEmailDetail(true);
      }
    },
    [isMobile],
  );

  const handleBackToList = useCallback(() => {
    setShowEmailList(true);
    setShowEmailDetail(false);
  }, []);

  const filteredEmails = useMemo(() => {
    if (!emails) return [];
    return emails.filter(
      (email: IEmail) =>
        email.mailboxId === selectedMailbox &&
        (email.subject.toLowerCase().includes(searchText.toLowerCase()) ||
          email.sender.toLowerCase().includes(searchText.toLowerCase()) ||
          email.preview.toLowerCase().includes(searchText.toLowerCase())),
    );
  }, [emails, selectedMailbox, searchText]);

  const selectedEmailData = useMemo(() => {
    if (!emails || !selectedEmail) return undefined;
    return emails.find((email: IEmail) => email.id === selectedEmail);
  }, [emails, selectedEmail]);

  return {
    mailboxes,
    isMailboxesLoading,
    emails,
    isEmailsLoading,
    emailDetail,
    isEmailDetailLoading,
    // streamAttachment,
    // isStreamAttachmentLoading,

    replyEmail,
    isReplyEmailPending,
    modifyEmail,
    isModifyEmailPending,

    checkedEmails,
    collapsed,
    setCollapsed,
    selectedMailbox,
    setSelectedMailbox,
    selectedEmail,
    searchText,
    setSearchText,
    showEmailList,
    showEmailDetail,

    handleCheckboxChange,
    handleSelectAll,
    handleEmailClick,
    handleBackToList,

    filteredEmails,
    selectedEmailData,
  };
};
