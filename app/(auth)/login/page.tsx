import LoginForm from "./login-form";

const LoginPage = () => {
  return (
    <div className=" flex flex-col item-center border-l-2 bg-gradient-to-r max-w-container h-screen from-emerald-300 to-emerald-700 border-emerald-500" >
    <div className="  mx-auto my-auto rounded-lg bg-white ">
      <LoginForm />
    </div>
    </div>
  );
};

export default LoginPage;
