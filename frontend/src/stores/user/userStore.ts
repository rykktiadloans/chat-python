import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./userSlice";
import { useDispatch } from "react-redux";

export const userStore = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type UserStore = typeof userStore;
export type UserRootState = ReturnType<UserStore["getState"]>;
export type UserDispatch = UserStore["dispatch"];

export const useUserDispatch = useDispatch.withTypes<UserDispatch>()
