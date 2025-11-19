'use client';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { App, Form, Input, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';
import { RegisterFormValues } from './interfaces/register.interface';
import {
  FormItem,
  LoginLink,
  RegisterContainer,
  StyledCard,
  SubmitButton,
} from './styles/RegisterPage.style';
import { useMutationRegister } from './hooks/registerAPI';

const { Title } = Typography;

export const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { notification } = App.useApp();

  const { mutate: register, isPending: isLoading } = useMutationRegister({
    onSuccess: () => {
      notification.success({
        message: 'Registration successful! Please login.',
      });
      router.push('/login');
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      notification.error({
        message: error.message || 'Registration failed. Please try again.',
      });
    },
  });

  const onFinish = async (values: RegisterFormValues) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      form.resetFields();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validatePassword = ({ getFieldValue }: any) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validator(_: any, value: string) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('The two passwords do not match!'));
    },
  });

  return (
    <RegisterContainer>
      <StyledCard>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Create an Account
        </Title>
        <Form
          form={form}
          name='register'
          onFinish={onFinish}
          layout='vertical'
          scrollToFirstError
        >
          <FormItem
            name='email'
            label='Email'
            rules={[
              {
                type: 'email',
                message: 'Please enter a valid email address!',
              },
              { required: true, message: 'Please input your email!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder='Enter your email'
              size='large'
            />
          </FormItem>

          <FormItem
            name='password'
            label='Password'
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder='Enter your password'
              size='large'
            />
          </FormItem>

          <FormItem
            name='confirmPassword'
            label='Confirm Password'
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              validatePassword,
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder='Confirm your password'
              size='large'
            />
          </FormItem>

          <FormItem>
            <SubmitButton
              type='submit'
              disabled={isLoading}
              data-loading={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </SubmitButton>
          </FormItem>
        </Form>

        <LoginLink>
          Already have an account? <a href='/login'>Sign in</a>
        </LoginLink>
      </StyledCard>
    </RegisterContainer>
  );
};
