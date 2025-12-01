'use client';

import {
  BoldOutlined,
  CloseOutlined,
  DeleteOutlined,
  ExpandOutlined,
  ItalicOutlined,
  LinkOutlined,
  MinusOutlined,
  MoreOutlined,
  PaperClipOutlined,
  SendOutlined,
  SmileOutlined,
  UnderlineOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { ISendEmailPayload } from '../interfaces/mailAPI.interface';

interface ComposeEmailModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (payload: ISendEmailPayload) => void;
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 0;
    border-radius: 8px;
    overflow: hidden;
  }

  .ant-modal-header {
    padding: 12px 16px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    margin: 0;
  }

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-footer {
    display: none;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
`;

const HeaderTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #202124;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 8px;

  .ant-btn {
    border: none;
    background: transparent;
    box-shadow: none;
    padding: 4px;
    height: auto;
    color: #5f6368;

    &:hover {
      background: #e8e8e8;
      color: #202124;
    }
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  min-width: 60px;
  color: #5f6368;
  font-size: 14px;
`;

const InputArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  .ant-input,
  .ant-select {
    border: none;
    box-shadow: none;
    padding: 0;

    &:focus {
      box-shadow: none;
    }
  }

  .ant-select-selector {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
`;

const CcBccToggle = styled.a`
  color: #1a73e8;
  font-size: 14px;
  margin-left: auto;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const EditorArea = styled.div`
  padding: 16px;
  min-height: 300px;

  .ant-input {
    border: none;
    resize: none;
    font-size: 14px;
    padding: 0;

    &:focus {
      box-shadow: none;
    }
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #fff;
`;

const ToolbarButton = styled(Button)<{ active?: boolean }>`
  border: none;
  background: ${({ active }) => (active ? '#e8f0fe' : 'transparent')};
  box-shadow: none;
  padding: 6px;
  height: auto;
  color: ${({ active }) => (active ? '#1a73e8' : '#5f6368')};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ active }) => (active ? '#d2e3fc' : '#f1f3f4')};
    color: ${({ active }) => (active ? '#1557b0' : '#202124')};
  }
`;

const RichTextEditor = styled.div<{ fontFamily: string; fontSize: string }>`
  min-height: 300px;
  border: none;
  outline: none;
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: ${({ fontSize }) => fontSize};
  color: #202124;
  line-height: 1.5;

  &:focus {
    outline: none;
  }

  &:empty:before {
    content: attr(data-placeholder);
    color: #5f6368;
  }
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
`;

const SendButton = styled(Button)`
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
  font-weight: 500;
  height: auto;

  &:hover {
    background: #1557b0;
    color: white;
  }

  &:disabled {
    background: #e8eaed;
    color: #80868b;
  }
`;

const ActionButton = styled(Button)`
  border: none;
  background: transparent;
  box-shadow: none;
  padding: 8px;
  height: auto;
  color: #5f6368;

  &:hover {
    background: #f1f3f4;
    color: #202124;
  }
`;

export const ComposeEmailModal: React.FC<ComposeEmailModalProps> = ({
  open,
  onClose,
  onSend,
}) => {
  const [form] = Form.useForm();
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSize] = useState('14px');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const checkFormatState = () => {
    setIsBold(document.queryCommandState('bold'));
    setIsItalic(document.queryCommandState('italic'));
    setIsUnderline(document.queryCommandState('underline'));

    let fontName = document.queryCommandValue('fontName');
    if (fontName) {
      fontName = fontName.replace(/['"]/g, '');
      if (fontName.toLowerCase().includes('arial')) {
        fontName = 'Arial';
      } else if (fontName.toLowerCase().includes('georgia')) {
        fontName = 'Georgia';
      } else if (fontName.toLowerCase().includes('times new roman')) {
        fontName = "'Times New Roman'";
      } else if (fontName.toLowerCase().includes('courier')) {
        fontName = "'Courier New'";
      } else {
        fontName = 'sans-serif';
      }
    } else {
      fontName = 'sans-serif';
    }

    setFontFamily(fontName);
  };

  const handleBold = () => {
    applyFormat('bold');
    setIsBold(!isBold);
    checkFormatState();
  };

  const handleItalic = () => {
    applyFormat('italic');
    setIsItalic(!isItalic);
    checkFormatState();
  };

  const handleUnderline = () => {
    applyFormat('underline');
    setIsUnderline(!isUnderline);
    checkFormatState();
  };

  const handleFontChange = (value: string) => {
    setFontFamily(value);
    applyFormat('fontName', value);
  };

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
  };

  const getEditorContent = () => {
    const editor = document.getElementById('email-editor');
    return editor?.innerHTML || '';
  };

  const handleSend = () => {
    const bodyContent = getEditorContent();

    form.validateFields().then((values) => {
      const payload: ISendEmailPayload = {
        to: values.to
          ? values.to.split(',').map((email: string) => email.trim())
          : [],
        subject: values.subject || '',
        body: bodyContent || '',
        cc: values.cc
          ? values.cc.split(',').map((email: string) => email.trim())
          : undefined,
        bcc: values.bcc
          ? values.bcc.split(',').map((email: string) => email.trim())
          : undefined,
      };
      onSend(payload);
      form.resetFields();
      setShowCc(false);
      setShowBcc(false);

      const editor = document.getElementById('email-editor');
      if (editor) editor.innerHTML = '';

      onClose();
    });
  };

  return (
    <StyledModal
      open={open}
      onCancel={onClose}
      width={600}
      closeIcon={null}
      title={null}
      footer={null}
    >
      <ModalHeader>
        <HeaderTitle>New Email</HeaderTitle>
        <HeaderActions>
          <Button
            type='text'
            size='small'
            icon={<MinusOutlined />}
            onClick={() => setIsMinimized(!isMinimized)}
          />
          <Button type='text' size='small' icon={<ExpandOutlined />} />
          <Button
            type='text'
            size='small'
            icon={<CloseOutlined />}
            onClick={onClose}
          />
        </HeaderActions>
      </ModalHeader>

      <Form form={form} layout='vertical'>
        <FormContainer>
          <FormRow>
            <Label>To</Label>
            <InputArea>
              <Form.Item
                name='to'
                style={{ margin: 0, flex: 1 }}
                rules={[
                  { required: true, message: 'Please enter the recipient' },
                ]}
              >
                <Input placeholder='Enter email address' />
              </Form.Item>
              {!showCc && !showBcc && (
                <CcBccToggle
                  onClick={() => {
                    setShowCc(true);
                    setShowBcc(true);
                  }}
                >
                  Cc Bcc
                </CcBccToggle>
              )}
            </InputArea>
          </FormRow>

          {showCc && (
            <FormRow>
              <Label>Cc</Label>
              <InputArea>
                <Form.Item name='cc' style={{ margin: 0, flex: 1 }}>
                  <Input placeholder='Cc' />
                </Form.Item>
              </InputArea>
            </FormRow>
          )}

          {showBcc && (
            <FormRow>
              <Label>Bcc</Label>
              <InputArea>
                <Form.Item name='bcc' style={{ margin: 0, flex: 1 }}>
                  <Input placeholder='Bcc' />
                </Form.Item>
              </InputArea>
            </FormRow>
          )}

          <FormRow>
            <Label>Subject</Label>
            <InputArea>
              <Form.Item name='subject' style={{ margin: 0, flex: 1 }}>
                <Input placeholder='Subject' />
              </Form.Item>
            </InputArea>
          </FormRow>
        </FormContainer>

        <Toolbar>
          <Select
            defaultValue='sans-serif'
            style={{ width: 120 }}
            bordered={false}
            size='small'
            onChange={handleFontChange}
            value={fontFamily}
          >
            <Select.Option value='sans-serif'>Sans Serif</Select.Option>
            <Select.Option value='Arial'>Arial</Select.Option>
            <Select.Option value='Georgia'>Georgia</Select.Option>
            <Select.Option value="'Times New Roman'">
              Times New Roman
            </Select.Option>
            <Select.Option value="'Courier New'">Courier New</Select.Option>
          </Select>

          <Select
            defaultValue='14px'
            style={{ width: 80 }}
            bordered={false}
            size='small'
            onChange={handleFontSizeChange}
            value={fontSize}
          >
            <Select.Option value='12px'>12</Select.Option>
            <Select.Option value='14px'>14</Select.Option>
            <Select.Option value='16px'>16</Select.Option>
            <Select.Option value='18px'>18</Select.Option>
            <Select.Option value='20px'>20</Select.Option>
            <Select.Option value='24px'>24</Select.Option>
          </Select>

          <ToolbarButton
            icon={<BoldOutlined />}
            size='small'
            onClick={handleBold}
            onMouseDown={(e) => e.preventDefault()}
            active={isBold}
          />
          <ToolbarButton
            icon={<ItalicOutlined />}
            size='small'
            onClick={handleItalic}
            onMouseDown={(e) => e.preventDefault()}
            active={isItalic}
          />
          <ToolbarButton
            icon={<UnderlineOutlined />}
            size='small'
            onClick={handleUnderline}
            onMouseDown={(e) => e.preventDefault()}
            active={isUnderline}
          />
        </Toolbar>

        <EditorArea>
          <RichTextEditor
            id='email-editor'
            contentEditable
            fontFamily={fontFamily}
            fontSize={fontSize}
            data-placeholder='Compose your email...'
            suppressContentEditableWarning
            onKeyUp={checkFormatState}
            onMouseUp={checkFormatState}
          />
        </EditorArea>

        <FooterActions>
          <SendButton icon={<SendOutlined />} onClick={handleSend}>
            Send
          </SendButton>
          <ActionButton icon={<PaperClipOutlined />} />
          <ActionButton icon={<LinkOutlined />} />
          <ActionButton icon={<SmileOutlined />} />
          <ActionButton icon={<MoreOutlined />} />
          <div style={{ flex: 1 }} />
          <ActionButton icon={<DeleteOutlined />} onClick={onClose} />
        </FooterActions>
      </Form>
    </StyledModal>
  );
};
