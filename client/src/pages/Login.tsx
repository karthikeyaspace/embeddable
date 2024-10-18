import React, { useState, FormEvent } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import t from "../components/Toast";

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { status, login, register } = useUser();
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  const validateForm = (): boolean => {
    if (!email || !password) {
      t("Please fill in all fields.", "error");
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      t("Passwords do not match.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (!res) t("Invalid credentials.", "error");
      else t("Logged in successfully.", "success");
    } else {
      const res = await register(email, password);
      if (!res) t("Email already exists.", "error");
      else t("Registered successfully.", "success");
    }
    setLoading(false);
  };

  if (status === "loading")
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  else if (status === "authenticated") navigate("/dashboard");
  else
    return (
      <div className="flex h-screen bg-white text-black">
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <img
            src="login.webp"
            alt="Login background"
            className="max-w-full h-screen object-cover"
          />
        </div>

        <div className="w-1/2 flex items-center justify-center bg-white">
          <div className="w-2/3 max-w-md">
            <h2 className="text-4xl font-bold mb-8 text-center">
              {isLogin ? "Welcome Back" : "Join Us"}
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-b-2 border-gray-300 focus:border-black outline-none transition-colors"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-b-2 border-gray-300 focus:border-black outline-none transition-colors"
                required
              />
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border-b-2 border-gray-300 focus:border-black outline-none transition-colors"
                  required
                />
              )}
              <button
                type="submit"
                className="w-full py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
              </button>
            </form>
            <p className="mt-6 text-center">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-2 font-semibold underline hover:text-gray-600"
                type="button"
              >
                {isLogin ? "Sign Up" : "Log In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
};

export default LoginRegister;
