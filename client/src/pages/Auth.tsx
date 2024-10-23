import React, { useState, FormEvent } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import t from "../components/Toast";
import { Loader2 } from "lucide-react";
import api from "../utils/axios";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [verificationSent, setVerificationSent] = useState(false);
  const { status, login, register } = useUser();
  const navigate = useNavigate();

  const resendVerification = async () => {
    try {
      setLoading(true);
      const response = await api.post("/resend-verification", { email });
      if (response.data.success) {
        t("New verification email sent!", "success");
      } else {
        t(
          response.data.message || "Failed to resend verification email",
          "error"
        );
      }
    } catch (error) {
      t("Failed to resend verification email", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!email || !password) {
      t("Please fill in all fields.", "error");
      return false;
    }
    if (!isLogin) {
      if (password.length < 8) {
        t("Password must be at least 8 characters long.", "error");
        return false;
      }
      if (password !== confirmPassword) {
        t("Passwords do not match.", "error");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (!res.success) {
          if (res.message === "Please verify your email first") {
            setVerificationSent(true);
          } else {
            t(res.message || "Invalid credentials", "error");
          }
        } else {
          t("Logged in successfully!", "success");
          navigate("/dashboard");
        }
      } else {
        const res = await register(email, password);
        if (!res.success) {
          t(res.message || "Registration failed", "error");
        } else {
          setVerificationSent(true);
          t(
            "Registration successful! Please check your email for verification.",
            "success"
          );
        }
      }
    } catch (error) {
      t("An error occurred. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setVerificationSent(false);
  };

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === "authenticated") {
    navigate("/dashboard");
    return null;
  }

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
          {verificationSent ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Verify Your Email</h2>
              <p>
                We've sent a verification link to {email}. Please check your
                inbox and click the link to verify your account.
              </p>

              <button className="mt-4" onClick={() => setIsLogin(true)}>
                Return to login
              </button>
            </div>
          ) : (
            <>
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
                </div>

                <button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
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
                    className="ml-2 text-primary hover:underline font-medium"
                    type="button"
                  >
                    {isLogin ? "Create one" : "Sign in"}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {verificationSent && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p>
            We've sent a verification link to {email}. Please check your inbox
            and click the link to verify your account.
          </p>
          <button
            onClick={resendVerification}
            className="mt-4 text-primary hover:underline"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                Sending...
              </>
            ) : (
              "Resend verification email"
            )}
          </button>
          <button
            className="block mx-auto mt-4 text-gray-600 hover:underline"
            onClick={() => setIsLogin(true)}
          >
            Return to login
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
