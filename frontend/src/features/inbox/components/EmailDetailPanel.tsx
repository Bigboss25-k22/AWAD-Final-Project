'use client';

import { IEmail, ISendMessageParams, ReplyEmailParams } from '../interfaces/mailAPI.interface';
import { EmailDetail } from '../styles/InboxPage.style';
import { Button, Card, Tooltip, Typography } from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  ForwardOutlined,
  SendOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Divider } from 'antd';
import { EmptyState } from './EmptyState';
import { ReplyEmailModal } from './ReplyEmailModal';
import { useState } from 'react';

const { Title, Text } = Typography;

interface EmailDetailProps {
  show: boolean;
  email: IEmail | undefined;
}

export const EmailDetailPanel: React.FC<EmailDetailProps> = ({
  show,
  email,
}) => {
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyParams, setReplyParams] = useState<ReplyEmailParams | undefined>();

  const handleReplyClick = () => {
    if (!email) return;

    // Chuẩn bị params cho reply modal
    const params: ReplyEmailParams = {
      to: [email.sender], // Lấy sẵn người gửi làm người nhận
      body: email.preview || '',
      includeOriginal: true, // Có thể bật/tắt tùy ý
    };

    setReplyParams(params);
    setReplyModalOpen(true);
  };

  const handleSendReply = (payload: ISendMessageParams) => {
    console.log('Sending reply:', payload);
    // TODO: Gọi API gửi email ở đây
    // Ví dụ: sendEmailMutation.mutate(payload);
  };

  return (
    <EmailDetail $show={show}>
      {email ? (
        <>
          <Card
            title={
              <div>
                <Title level={4} style={{ marginBottom: 0 }}>
                  {email.subject}
                </Title>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 8,
                  }}
                >
                  <div>
                    <Text type='secondary'>From: {email.sender}</Text>
                  </div>
                  <div style={{ marginLeft: '8px' }}>
                    <Text type='secondary' style={{ marginRight: 8 }}>
                      {new Date(email.timestamp).toLocaleString()}
                    </Text>
                    <Tooltip title='Toggle star'>
                      <Button type='text' icon={<StarOutlined />} />
                    </Tooltip>
                    <Tooltip title='Forward'>
                      <Button type='text' icon={<ForwardOutlined />} />
                    </Tooltip>
                    <Tooltip title='Reply'>
                      <Button
                        type='text'
                        icon={<SendOutlined />}
                        onClick={handleReplyClick}
                      />
                    </Tooltip>
                    <Tooltip title='Delete'>
                      <Button type='text' icon={<DeleteOutlined />} />
                    </Tooltip>
                  </div>
                </div>
              </div>
            }
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <div style={{ whiteSpace: 'pre-line' }}>
              <p>Hello,</p>
              <p>
                This is a sample email content. You can view the details of the
                email here.
              </p>
              <p>Best regards,</p>
              <p>Sender</p>
            </div>
            {email.hasAttachment && (
              <div style={{ marginTop: 24 }}>
                <Divider orientation='left'>Attachment</Divider>
                <div style={{ padding: '8px 0' }}>
                  <Button icon={<DownloadOutlined />} type='link'>
                    document.pdf
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <ReplyEmailModal
            open={replyModalOpen}
            onClose={() => setReplyModalOpen(false)}
            onSend={handleSendReply}
            replyParams={replyParams}
            originalSubject={email.subject}
          />
        </>
      ) : (
        <EmptyState />
      )}
    </EmailDetail>
  );
};
