import React from "react";
import { useAuthCallback } from "./hooks/useAuthCallback";
import { Spin } from "antd";

export const AuthCallbackPage: React.FC = () => {
  useAuthCallback(); // Kích hoạt logic

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Spin size="large" tip="Processing login..." />
    </div>
  );
};
