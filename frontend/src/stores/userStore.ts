import { create } from "zustand";
import { initialState, type UserCredentials, type UserState } from "../model/user";

export interface UserStore {
  user: UserState;
  setUser: (credentials: UserCredentials, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: initialState,

  setUser: (credentials, token) => {
    set((state) => ({
      user: {
        credentials: credentials,
        token: token,
      },
    }));
  },

  logout: () => {
    set((state) => ({
      user: {
        credentials: null,
        token: null,
      },
    }));
  },

}));
