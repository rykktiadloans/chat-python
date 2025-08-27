import FormField from "../components/FormField";

function Register() {
  return (
    <main className="w-full h-screen py-9 bg-gray-200 flex flex-col items-center gap-10">
      <div className="w-full sm:w-sm flex shrink flex-col bg-white p-3 gap-6 border-1 border-gray-400 rounded-xl">
        <h1 className="font-bold text-4xl text-center text-emerald-600">Register</h1>
        <form action="/api/v1/users/login" method="POST" className="flex flex-col gap-3">
          <FormField label="Username" name="username" />
          <FormField label="Password" name="password" />
          <FormField label="Confirm password" name="confirm-password" />
          <div className="flex flex-col gap-0.5 text-red-500 border-1 border-red-500 rounded-md p-2 font-bold">
            <p>The password fields are different!</p>
          </div>
          <div className="flex flex-col items-center">
            <input
              type="submit"
              value="Register"
              className="transition-colors border-1 border-emerald-400 rounded-md
              hover:border-transparent hover:bg-emerald-400 hover:text-white hover:font-bold p-2 w-fit"
            />
          </div>
        </form>
      </div>
    </main>
  );
}

export default Register;
