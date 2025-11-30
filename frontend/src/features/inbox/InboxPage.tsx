'use client';

import { useWindowSize } from '@/hooks/useWindowSize';
import { breakpoints } from '@/themes/breakpoint';
import { Layout } from 'antd';
import React from 'react';
import { EmailDetailPanel } from './components/EmailDetailPanel';
import { MobileHeaderBar } from './components/MobileHeaderBar';
import { Sidebar } from './components/SideBar';
import { useInbox } from './hooks/useInbox';
import { DivEmailList, StyledLayout } from './styles/InboxPage.style';
import { EmailListPanel } from './components/EmailListPanel';
import { ComposeEmailModal } from './components/ComposeEmailModal';

const InboxPage: React.FC = () => {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width <= Number(breakpoints.md);

  const {
    mailboxes,
    emails,
    checkedEmails,
    collapsed,
    setCollapsed,
    selectedMailbox,
    setSelectedMailbox,
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
  } = useInbox({ isMobile });

  return (
    <>
      <StyledLayout>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
          selectedMailbox={selectedMailbox}
          setSelectedMailbox={setSelectedMailbox}
          mailboxes={mailboxes || []}
          emails={emails || []}
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <Layout>
          <MobileHeaderBar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            showEmailList={showEmailList}
            handleBackToList={handleBackToList}
          />

          <DivEmailList>
            <EmailListPanel
              showEmailList={showEmailList}
              checkedEmails={checkedEmails}
              handleSelectAll={handleSelectAll}
              filteredEmails={filteredEmails}
              handleCheckboxChange={handleCheckboxChange}
              handleEmailClick={handleEmailClick}
            />

            <EmailDetailPanel
              show={!isMobile || showEmailDetail}
              email={selectedEmailData}
            />
          </DivEmailList>
        </Layout>
      </StyledLayout>
      <ComposeEmailModal
        open={true}
        onClose={() => {}}
        onSend={(payload) => {
          console.log('Send email payload:', payload);
        }}
      />
    </>
  );
};

export default InboxPage;
