import { create } from "zustand";
import { type UserCredentials, type UserState } from "../model/user";
import { loginToToken } from "../api/user";

export interface UserStore {
  user: UserState | null;
  setUser: (credentials: UserCredentials, token: string) => void;
  login: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,

  setUser: (credentials, token) => {
    set((state) => ({
      user: {
        credentials: credentials,
        token: token,
      },
    }));
  },

  login: async (credentials) => {
    const token = await loginToToken(credentials);
    if (token !== null) {
      set((state) => ({
        user: {
          credentials: credentials,
          token: token,
        },
      }));
    }
  },

  logout: () => {
    set((state) => ({
      user: null,
    }));
  },
}));
