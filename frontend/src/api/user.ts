import type { UserCredentials } from "../model/user";

export async function loginToToken(credentials: UserCredentials): Promise<string | null> {
  const response = await fetch("/api/v1/users/login", {
    method: "POST",
    body: new URLSearchParams({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  if (response.status === 401) {
    throw new Error("Wrong username or password");
  }

  if (response.ok) {
    const json = await response.json();
    return json.token;
  }

  throw new Error("There was an error logging in");

}
