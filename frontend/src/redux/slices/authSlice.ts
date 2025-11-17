import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface AuthenticationState {
  accessToken: string | null;
}

const initialState: AuthenticationState = {
  accessToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
  },
});

export const selectAccessToken = (state: { auth: AuthenticationState }) =>
  state.auth.accessToken;

export const { setAccessToken } = authSlice.actions;

export default authSlice.reducer;
