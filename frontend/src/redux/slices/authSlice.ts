import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

// 1. Interface User (giữ nguyên)
interface User {
  id: string;
  email: string;
  name?: string;
  provider?: string;
}

// 2. Interface State (giữ nguyên)
interface AuthenticationState {
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthenticationState = {
  accessToken: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // --- Action CŨ (giữ lại để tương thích ngược) ---
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      // Khi chỉ set token, ta có thể không set user hoặc giữ nguyên user cũ
      // Nếu muốn an toàn, có thể set user = null nếu token null
      if (!action.payload) {
        state.user = null;
      }
    },

    // --- Action MỚI (dùng cho Google OAuth) ---
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
    },

    logout: (state) => {
      state.accessToken = null;
      state.user = null;
    },
  },
});

// Export cả 2 selector
export const selectAccessToken = (state: { auth: AuthenticationState }) =>
  state.auth.accessToken;
export const selectCurrentUser = (state: { auth: AuthenticationState }) =>
  state.auth.user;

// Export cả 2 action
export const { setAccessToken, setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
