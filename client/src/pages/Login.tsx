import React from "react";

const Login: React.FC = () => {
  return (
    <div className="flex w-full h-full">
      <div className="flex-1 p-10">Only Chatbot You Need for Your Business</div>
      <div className="flex-1">
        <div className="flex justify-center">
          <div className="w-96">
            <div className="text-3xl font-bold">Login</div>
            <div className="mt-5">
              <input
                type="text"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-5">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-5">
              <button className="w-full p-3 bg-blue-500 text-white rounded-md">
                Login
              </button>
            </div>
            <div className="mt-5 text-center">
              Don't have an account?{" "}
              fuck off
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
