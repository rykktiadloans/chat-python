export interface UserCredentials {
  username: string;
  password: string;
}

export interface UserState {
  credentials: UserCredentials;
  token: string;
}
