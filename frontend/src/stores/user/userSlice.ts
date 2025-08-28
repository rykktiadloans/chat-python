import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialState, type UserCredentials, type UserState } from "./userModel";
import type { UserRootState } from "./userStore";

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (
      _: UserState,
      action: PayloadAction<{ credentials: UserCredentials; token: string }>,
    ) => {
      return {
        credentials: action.payload.credentials,
        token: action.payload.token,
      };
    },
    logout: () => ({
      credentials: null,
      token: null,
    }),
  },
});

export const { setUser, logout } = userSlice.actions;

export const selectToken = (state: UserRootState) => state.user.token;

export const selectUsername = (state: UserRootState) => state.user.credentials?.username;

export default userSlice.reducer;
