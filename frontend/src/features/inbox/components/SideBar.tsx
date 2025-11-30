'use client';

import {
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  FolderOutlined,
  InboxOutlined,
  SendOutlined,
  StarOutlined,
} from '@ant-design/icons';
import { Button, Input, Menu } from 'antd';
import { IEmail, IMailbox } from '../interfaces/mailAPI.interface';
import { StyledSider } from '../styles/InboxPage.style';

const { Search } = Input;

export const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  isMobile: boolean;
  selectedMailbox: string;
  setSelectedMailbox: (v: string) => void;
  mailboxes: IMailbox[];
  emails: IEmail[];
  searchText: string;
  setSearchText: (v: string) => void;
}> = ({
  collapsed,
  setCollapsed,
  isMobile,
  selectedMailbox,
  setSelectedMailbox,
  mailboxes,
  searchText,
  setSearchText,
}) => {
  const items = mailboxes?.map((mailbox) => {
    let icon;
    switch (mailbox.name.toLowerCase()) {
      case 'inbox':
        icon = <InboxOutlined />;
        break;
      case 'starred':
        icon = <StarOutlined />;
        break;
      case 'sent':
        icon = <SendOutlined />;
        break;
      case 'drafts':
        icon = <FileOutlined />;
        break;
      case 'trash':
        icon = <DeleteOutlined />;
        break;
      default:
        icon = <FolderOutlined />;
    }
    return {
      key: mailbox.id,
      icon,
      label: mailbox.name,
    };
  });

  return (
    <StyledSider
      key='main-sider'
      width={250}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={null}
      collapsedWidth={isMobile ? 0 : 80}
    >
      <div style={{ padding: '16px', textAlign: 'center' }}>
        <Button
          type='primary'
          icon={<EditOutlined />}
          block
          style={{ marginBottom: '16px' }}
        >
          {!collapsed && 'Compose'}
        </Button>
        <Search
          placeholder='Search...'
          onSearch={setSearchText}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: '16px' }}
          allowClear
        />
      </div>
      <Menu
        mode='inline'
        selectedKeys={[selectedMailbox]}
        onClick={({ key }) => setSelectedMailbox(key as string)}
        items={items}
      />
    </StyledSider>
  );
};
