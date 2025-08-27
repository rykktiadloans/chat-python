
function Login() {
  return (
    <main className="w-full h-screen py-9 bg-gray-200 flex flex-col items-center gap-10">
      <div className="flex flex-col bg-white p-3 gap-6 border-1 border-gray-400 rounded-xl">
        <h1 className="font-bold text-4xl text-center text-emerald-600">Login</h1>
        <form action="/api/v1/users/login" method="POST" className="flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" className="transition-colors border-1 border-gray-800
              hover:border-emerald-400 rounded-md p-1"/>
          </div>
          <div className="flex flex-col gap-0.5">
            <label htmlFor="password">Password</label>
            <input type="text" name="password" id="password" className="transition-colors border-1 border-gray-800
              hover:border-emerald-400 rounded-md p-1"/>
          </div>
          <div className="flex flex-col gap-0.5 text-red-500 border-1 border-red-500 rounded-md p-2 font-bold">
            <p>Incorrect credentials!</p>
          </div>
          <div className="flex flex-col items-center">
            <input type="submit" value="Log in" className="transition-colors border-1 border-emerald-400 rounded-md
              hover:border-transparent hover:bg-emerald-400 hover:text-white hover:font-bold p-2 w-fit" />
          </div>
        </form>
      </div>
    </main>
  );
}

export default Login;
