export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserState {
  credentials: UserCredentials | null;
  token: string | null;
}

export const initialState: UserState = {
  credentials: null,
  token: null
}
