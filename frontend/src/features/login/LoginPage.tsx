"use client";
import { LockOutlined, MailOutlined, GoogleOutlined } from "@ant-design/icons";
import { Form, Input, Typography, Divider, Button } from "antd";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/slices/authSlice";

import { useLogin } from "./hooks/useLogin";
import {
  FormItem,
  LoginContainer,
  StyledCard,
  SubmitButton,
} from "./styles/LoginPage.style";

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const router = useRouter();
  const accessToken = useAppSelector(selectAccessToken);
  const {
    form,
    onFinish,
    isLoading,
    handleGoogleLogin,
  } = useLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (accessToken) {
      router.push('/inbox');
    }
  }, [accessToken, router]);

  return (
    <LoginContainer>
      <StyledCard>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Welcome Back
        </Title>
        <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
          <FormItem
            name="email"
            label="Email"
            rules={[
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
              { required: true, message: "Please input your email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Enter your email"
              size="large"
            />
          </FormItem>
          <FormItem
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#bfbfbf" }} />}
              placeholder="Enter your password"
              size="large"
            />
          </FormItem>

          <FormItem>
            <SubmitButton type="primary" loading={isLoading} htmlType="submit">
              Login
            </SubmitButton>
          </FormItem>
        </Form>
        <Divider>OR</Divider>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="large"
            block
            icon={<GoogleOutlined />}
            onClick={handleGoogleLogin}
            loading={isLoading}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 500 
            }}
          >
            Sign in with Google
          </Button>
        </div>
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Typography.Text>
            Don't have an account? <Link href="/register">Register</Link>
          </Typography.Text>
        </div>
      </StyledCard>
    </LoginContainer>
  );
};

export default LoginPage;
