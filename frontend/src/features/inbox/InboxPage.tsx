"use client";

import {
  ArrowLeftOutlined,
  CheckOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  ForwardOutlined,
  InboxOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  PaperClipOutlined,
  ReloadOutlined,
  SendOutlined,
  StarFilled,
  StarOutlined as StarO,
  StarOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Dropdown,
  Input,
  Layout,
  Menu,
  Typography,
} from "antd";
import React, { useState } from "react";
import styled from "styled-components";

const { Sider } = Layout;
const { Text, Title } = Typography;
const { Search } = Input;

// Styled Components
const StyledLayout = styled(Layout)`
  height: 100vh;
`;

interface StyledSiderProps {
  collapsed: boolean;
  key: string;
}

const StyledSider = styled(Sider)<StyledSiderProps>`
  background: #fff;
  border-right: 1px solid #f0f0f0;
  @media (max-width: 768px) {
    display: ${({ collapsed }) => (collapsed ? "none" : "block")};
    position: absolute;
    z-index: 10;
    height: 100%;
  }
`;

interface EmailListProps {
  show: boolean;
}

const EmailList = styled.div<EmailListProps>`
  flex: 1;

  overflow-y: none;
  border-right: 1px solid #f0f0f0;
  @media (max-width: 992px) {
    display: ${({ show }) => (show ? "block" : "none")};
    width: 100%;
  }
`;

const DivEmailList = styled.div`
  overflow-y: auto;
  height: calc(100% - 56px);
  display: flex;
  &::-webkit-scrollbar {
    display: block;
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(198, 198, 200, 1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: rgba(242, 242, 242, 1);
  }
`;

interface EmailDetailProps {
  show: boolean;
}

const EmailDetail = styled.div<EmailDetailProps>`
  flex: 1;
  overflow-y: none;
  padding: 24px;
  @media (max-width: 992px) {
    display: ${({ show }) => (show ? "block" : "none")};
    width: 100%;
  }
`;

interface EmailItemProps {
  selected: boolean;
}

const EmailItem = styled.div<EmailItemProps>`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  background: ${({ selected }) => (selected ? "#e6f7ff" : "white")};
  &:hover {
    background: #f5f5f5;
  }
`;

const EmailPreview = styled.div`
  flex: 1;
  margin-left: 16px;
  overflow: hidden;
`;

const EmailSubject = styled.div`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmailTime = styled.span`
  color: #8c8c8c;
  font-size: 12px;
`;

const Toolbar = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const MobileHeader = styled.div`
  display: none;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  @media (max-width: 992px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

// Mock data
const mockMailboxes: IMailbox[] = [
  { id: "inbox", name: "Inbox" },
  { id: "starred", name: "Starred" },
  { id: "sent", name: "Sent" },
  { id: "drafts", name: "Drafts" },
  { id: "archive", name: "Archive" },
  { id: "trash", name: "Trash" },
  { id: "custom1", name: "Work" },
  { id: "custom2", name: "Personal" },
];

const mockEmails: IEmail[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  mailboxId: "inbox",
  sender:
    i % 2 === 0
      ? "John Doe <john@example.com>"
      : "Jane Smith <jane@example.com>",
  subject: `This is email subject ${i + 1}`,
  preview: "This is a preview of the email content...",
  timestamp: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
  isRead: i > 2,
  isStarred: i % 4 === 0,
  hasAttachment: i % 3 === 0,
}));

// Types
export interface IMailbox {
  id: string;
  name: string;
}

export interface IEmail {
  id: string;
  mailboxId: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead?: boolean;
  isStarred?: boolean;
  hasAttachment?: boolean;
}

const InboxPage: React.FC = () => {
  const [checkedEmails, setCheckedEmails] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (emailId: string, checked: boolean) => {
    const newCheckedEmails = new Set(checkedEmails);
    if (checked) {
      newCheckedEmails.add(emailId);
    } else {
      newCheckedEmails.delete(emailId);
    }
    setCheckedEmails(newCheckedEmails);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setCheckedEmails(new Set(filteredEmails.map((email) => email.id)));
    } else {
      setCheckedEmails(new Set());
    }
  };
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMailbox, setSelectedMailbox] = useState("inbox");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const [showEmailList, setShowEmailList] = useState(true);
  const [showEmailDetail, setShowEmailDetail] = useState(false);

  // Handle window resize
  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 992;
      setIsMobile(mobile);
      if (mobile) {
        setShowEmailList(!showEmailDetail);
      } else {
        setShowEmailList(true);
        setShowEmailDetail(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [showEmailDetail]);

  const filteredEmails = mockEmails.filter(
    (email) =>
      email.mailboxId === selectedMailbox &&
      (email.subject.toLowerCase().includes(searchText.toLowerCase()) ||
        email.sender.toLowerCase().includes(searchText.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchText.toLowerCase()))
  );

  const selectedEmailData = mockEmails.find(
    (email) => email.id === selectedEmail
  );

  const handleEmailClick = (emailId: string) => {
    setSelectedEmail(emailId);
    if (isMobile) {
      setShowEmailList(false);
      setShowEmailDetail(true);
    }
  };

  const handleBackToList = () => {
    setShowEmailList(true);
    setShowEmailDetail(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const menu = (
    <Menu>
      <Menu.Item key="markAsRead" icon={<CheckOutlined />}>
        Đánh dấu đã đọc
      </Menu.Item>
      <Menu.Item key="markAsUnread" icon={<MailOutlined />}>
        Đánh dấu chưa đọc
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" danger icon={<DeleteOutlined />}>
        Xóa
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledLayout>
      <StyledSider
        key="main-sider"
        width={250}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
        collapsedWidth={isMobile ? 0 : 80}
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            block
            style={{ marginBottom: "16px" }}
          >
            {!collapsed && "Soạn thư"}
          </Button>
          <Search
            placeholder="Tìm kiếm..."
            onSearch={(value) => setSearchText(value)}
            style={{ marginBottom: "16px" }}
            allowClear
          />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedMailbox]}
          onClick={({ key }) => setSelectedMailbox(key as string)}
        >
          <Menu.Item key="inbox" icon={<InboxOutlined />}>
            Hộp thư đến{" "}
            <span style={{ float: "right" }}>{mockEmails.length}</span>
          </Menu.Item>
          <Menu.Item key="starred" icon={<StarOutlined />}>
            Đã gắn dấu sao
          </Menu.Item>
          <Menu.Item key="sent" icon={<SendOutlined />}>
            Đã gửi
          </Menu.Item>
          <Menu.Item key="drafts" icon={<FileOutlined />}>
            Nháp
          </Menu.Item>
          <Menu.Item key="archive" icon={<FolderOutlined />}>
            Lưu trữ
          </Menu.Item>
          <Menu.Item key="trash" icon={<DeleteOutlined />}>
            Thùng rác
          </Menu.Item>
          <Menu.Divider />
          <Menu.ItemGroup title="Thư mục">
            {mockMailboxes.slice(6).map((mailbox) => (
              <Menu.Item key={mailbox.id} icon={<FolderOutlined />}>
                {mailbox.name}
              </Menu.Item>
            ))}
          </Menu.ItemGroup>
        </Menu>
      </StyledSider>

      <Layout>
        <MobileHeader>
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            type="text"
          />
          {!showEmailList && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToList}
              type="text"
            >
              Quay lại
            </Button>
          )}
          <div style={{ flex: 1 }}></div>
          <Button icon={<ReloadOutlined />} type="text" />
        </MobileHeader>

        <DivEmailList>
          <EmailList show={showEmailList}>
            <Toolbar>
              <Checkbox
                onChange={(e) => handleSelectAll(e.target.checked)}
                checked={
                  checkedEmails.size > 0 &&
                  checkedEmails.size === filteredEmails.length
                }
                indeterminate={
                  checkedEmails.size > 0 &&
                  checkedEmails.size < filteredEmails.length
                }
              />
              <Button type="text" icon={<ReloadOutlined />} />
              <Button type="text" icon={<DeleteOutlined />} />
              <Button type="text" icon={<MailOutlined />} />
              <Dropdown overlay={menu} trigger={["click"]}>
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
              <div style={{ flex: 1 }} />
              <Button type="text" icon={<CheckSquareOutlined />} />
            </Toolbar>

            <div style={{ height: "calc(100vh - 112px)", overflowY: "auto" }}>
              {filteredEmails.map((email) => (
                <EmailItem
                  key={email.id}
                  selected={selectedEmail === email.id}
                  onClick={() => handleEmailClick(email.id)}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 40,
                      }}
                    >
                      <Checkbox
                        style={{ marginRight: 8 }}
                        checked={checkedEmails.has(email.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(email.id, e.target.checked);
                        }}
                      />
                      <Button
                        type="text"
                        icon={
                          email.isStarred ? (
                            <StarFilled style={{ color: "#faad14" }} />
                          ) : (
                            <StarO />
                          )
                        }
                        style={{ marginRight: 8 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Toggle star status
                        }}
                      />
                    </div>
                    <EmailPreview>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <EmailSubject
                          style={{
                            fontWeight: email.isRead ? "normal" : "bold",
                          }}
                        >
                          {email.sender.split("<")[0].trim()}
                        </EmailSubject>
                        <EmailTime>{formatDate(email.timestamp)}</EmailTime>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <Text
                            strong={!email.isRead}
                            style={{ marginRight: 8 }}
                          >
                            {email.subject}
                          </Text>
                          <Text type="secondary">
                            {email.preview.length > 50
                              ? `${email.preview.substring(0, 50)}...`
                              : email.preview}
                          </Text>
                        </div>
                        {email.hasAttachment && (
                          <PaperClipOutlined style={{ color: "#8c8c8c" }} />
                        )}
                      </div>
                    </EmailPreview>
                  </div>
                </EmailItem>
              ))}
            </div>
          </EmailList>

          <EmailDetail show={!isMobile || showEmailDetail}>
            {selectedEmailData ? (
              <Card
                title={
                  <div>
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {selectedEmailData.subject}
                    </Title>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 8,
                      }}
                    >
                      <Text type="secondary">
                        Từ: {selectedEmailData.sender}
                      </Text>
                      <div>
                        <Text type="secondary" style={{ marginRight: 16 }}>
                          {new Date(
                            selectedEmailData.timestamp
                          ).toLocaleString()}
                        </Text>
                        <Button type="text" icon={<StarOutlined />} />
                        <Button type="text" icon={<ForwardOutlined />} />
                        <Button type="text" icon={<SendOutlined />} />
                        <Button type="text" icon={<DeleteOutlined />} />
                      </div>
                    </div>
                  </div>
                }
                bordered={false}
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                bodyStyle={{ flex: 1, overflowY: "auto" }}
              >
                <div style={{ whiteSpace: "pre-line" }}>
                  <p>Xin chào,</p>
                  <p>
                    Đây là nội dung email mẫu. Bạn có thể xem chi tiết email ở
                    đây.
                  </p>
                  <p>Trân trọng,</p>
                  <p>Người gửi</p>
                </div>
                {selectedEmailData.hasAttachment && (
                  <div style={{ marginTop: 24 }}>
                    <Divider orientation="left">Tệp đính kèm</Divider>
                    <div style={{ padding: "8px 0" }}>
                      <Button icon={<DownloadOutlined />} type="link">
                        document.pdf
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#8c8c8c",
                }}
              >
                <MailOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <Text>Chọn một email để xem nội dung</Text>
              </div>
            )}
          </EmailDetail>
        </DivEmailList>
      </Layout>
    </StyledLayout>
  );
};

export default InboxPage;
