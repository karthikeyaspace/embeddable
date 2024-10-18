import React, { useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

const LoginRegister: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { status } = useAuth();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const validateForm = (): boolean => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    console.log(email, password);
  };

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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-colors"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Processing..."
                : isLogin
                ? "Log In"
                : "Sign Up"}
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
