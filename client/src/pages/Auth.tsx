import React, { useState, FormEvent, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import t from "../components/Toast";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { status, login, register } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") navigate("/dashboard");
  }, [status]);

  useEffect(() => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [isLogin]);

  const validateForm = () => {
    if (!email || !password) {
      t("Please fill in all fields.", "error");
      return false;
    }
    if (!isLogin && (password.length < 8 || password !== confirmPassword)) {
      t(password.length < 8 ? "Password must be at least 8 characters long." : "Passwords do not match.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      isLogin ? await login(email, password) : await register(email, password);
    } catch (error: any) {
      t(error?.response?.data?.message || "An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  if (status == "unauthenticated")
    return (
      <div className="flex h-screen bg-white">
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <img
            src="/login.webp"
            alt="Login background"
            className="max-w-full h-screen object-cover"
          />
        </div>

        <div className="w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="mt-2 text-gray-600">
                {isLogin
                  ? "Sign in to access your account"
                  : "Join us and create your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 p-3 border-b-2 border-gray-300 focus:border-black outline-none transition-colors"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-8 pr-10 p-3 border-b-2 border-gray-300 focus:border-black outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-8 pr-10 p-3 border-b-2 border-gray-300 focus:border-black outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-black hover:underline font-medium"
                  type="button"
                >
                  {isLogin ? "Create one" : "Sign in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Auth;
