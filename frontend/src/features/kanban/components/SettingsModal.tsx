'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Input,
  Select,
  Form,
  Space,
  Popconfirm,
  message,
  Spin,
} from 'antd';
import {
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  useGetKanbanColumns,
  useMutationCreateColumn,
  useMutationUpdateColumn,
  useMutationDeleteColumn,
} from '../hooks/kanbanAPIs';
import {
  IKanbanColumn,
  ICreateColumnInput,
  IUpdateColumnInput,
} from '../interfaces/kanbanColumn.interface';
import {
  SettingsContent,
  ColumnListContainer,
  ColumnItem,
  ColumnInfo,
  ColumnName,
  ColumnLabel,
  ColumnActions,
  FormSection,
  FormTitle,
  EmptyState,
  LoadingContainer,
} from '../styles/SettingsModal.style';

const GMAIL_LABELS = [
  { value: 'INBOX', label: 'Inbox' },
  { value: 'STARRED', label: 'Starred' },
  { value: 'IMPORTANT', label: 'Important' },
  { value: 'UNREAD', label: 'Unread' },
  { value: 'CATEGORY_PERSONAL', label: 'Personal' },
  { value: 'CATEGORY_SOCIAL', label: 'Social' },
  { value: 'CATEGORY_PROMOTIONS', label: 'Promotions' },
  { value: 'CATEGORY_UPDATES', label: 'Updates' },
  { value: 'CATEGORY_FORUMS', label: 'Forums' },
];

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [editingColumn, setEditingColumn] = useState<IKanbanColumn | null>(
    null,
  );
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const { data: columns = [], isLoading } = useGetKanbanColumns();

  const createMutation = useMutationCreateColumn({
    onSuccess: () => {
      message.success('Column created successfully');
      resetForm();
    },
    onError: (error) => {
      message.error(error.message || 'Failed to create column');
    },
  });

  const updateMutation = useMutationUpdateColumn({
    onSuccess: () => {
      message.success('Column updated successfully');
      resetForm();
    },
    onError: (error) => {
      message.error(error.message || 'Failed to update column');
    },
  });

  const deleteMutation = useMutationDeleteColumn({
    onSuccess: () => {
      message.success('Column deleted successfully');
    },
    onError: (error) => {
      message.error(error.message || 'Failed to delete column');
    },
  });

  // Auto-create INBOX column if user has no columns
  useEffect(() => {
    if (!isLoading && columns.length === 0 && !hasInitialized && open) {
      setHasInitialized(true);
      createMutation.mutate({ name: 'INBOX', label: 'INBOX' });
    }
  }, [isLoading, columns.length, hasInitialized, open]);

  const resetForm = () => {
    form.resetFields();
    setEditingColumn(null);
    setIsFormVisible(false);
  };

  const handleSubmit = async (values: { name?: string; label: string }) => {
    if (editingColumn) {
      const input: IUpdateColumnInput = {
        name: values.name,
        label: values.label,
      };
      await updateMutation.mutateAsync({ id: editingColumn.id, input });
    } else {
      const input: ICreateColumnInput = {
        name: values.name,
        label: values.label,
      };
      await createMutation.mutateAsync(input);
    }
  };

  const handleEdit = (column: IKanbanColumn) => {
    setEditingColumn(column);
    setIsFormVisible(true);
    form.setFieldsValue({
      name: column.name,
      label: column.label,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  const handleAddNew = () => {
    resetForm();
    setIsFormVisible(true);
  };

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>Kanban Settings</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
    >
      <SettingsContent>
        <ColumnListContainer>
          {isLoading ? (
            <LoadingContainer>
              <Spin tip='Loading columns...' />
            </LoadingContainer>
          ) : columns.length === 0 ? (
            <EmptyState>Initializing default INBOX column...</EmptyState>
          ) : (
            columns.map((column) => (
              <ColumnItem key={column.id}>
                <ColumnInfo>
                  <ColumnName>{column.name}</ColumnName>
                  <ColumnLabel>Label: {column.label}</ColumnLabel>
                </ColumnInfo>
                <ColumnActions>
                  <Button
                    type='text'
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(column)}
                  />
                  <Popconfirm
                    title='Delete column'
                    description='Are you sure you want to delete this column?'
                    onConfirm={() => handleDelete(column.id)}
                    okText='Delete'
                    cancelText='Cancel'
                    okButtonProps={{ danger: true }}
                  >
                    <Button type='text' danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </ColumnActions>
              </ColumnItem>
            ))
          )}
        </ColumnListContainer>

        {!isFormVisible ? (
          <Button
            type='dashed'
            block
            icon={<PlusOutlined />}
            onClick={handleAddNew}
          >
            Add Column
          </Button>
        ) : (
          <FormSection>
            <FormTitle>
              {editingColumn ? 'Edit Column' : 'New Column'}
            </FormTitle>
            <Form form={form} layout='vertical' onFinish={handleSubmit}>
              <Form.Item
                name='name'
                label='Column Name'
                tooltip='Leave empty to use the Gmail label as the column name'
              >
                <Input placeholder='e.g., To Review (optional)' />
              </Form.Item>
              <Form.Item
                name='label'
                label='Gmail Label'
                rules={[{ required: true, message: 'Please select a label' }]}
              >
                <Select
                  placeholder='Select Gmail label'
                  options={GMAIL_LABELS}
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Space>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {editingColumn ? 'Update' : 'Create'}
                  </Button>
                  <Button onClick={resetForm}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </FormSection>
        )}
      </SettingsContent>
    </Modal>
  );
};
