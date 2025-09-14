import { useState, type FormEvent } from "react";
import FormField from "../components/FormField";
import { useNavigate } from "react-router";
import { useUserStore } from "../stores/userStore";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === "" || password === "") {
      setError("Empty entries!");
      return;
    }
    login({
      username: username,
      password: password,
    })
      .then(() => {
        setError("");
        navigate("/");
      })
      .catch((error) => {
        setError(error.toString());
      });
  };
  return (
    <main className="w-full h-screen py-9 bg-gray-200 flex flex-col items-center gap-10">
      <div className="w-full sm:w-96 flex flex-col bg-white p-3 gap-6 border border-gray-400 rounded-xl">
        <h1 className="font-bold text-4xl text-center text-emerald-600">Login</h1>
        <form
          action="/api/v1/users/login"
          method="POST"
          className="flex flex-col gap-3"
          onSubmit={onSubmit}
        >
          <FormField
            label="Username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <FormField
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div
            className={
              "flex flex-col gap-0.5 text-red-500 border border-red-500 rounded-md p-2 font-bold " +
              (error.length === 0 ? "hidden" : "")
            }
          >
            <p>{error}</p>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="submit"
              value="Log in"
              className="transition-colors border border-emerald-400 rounded-md
              hover:border-transparent hover:bg-emerald-400 hover:text-white hover:font-bold p-2 w-fit"
            />
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
