import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ChatbotConfig } from "../utils/types";
import api from "../utils/axios";
import t from "../components/Toast";
import { getLs, setLs } from "../utils/localstorage";

interface User {
  userId: string;
  status: "authenticated" | "unauthenticated" | "loading";
  chatbotConfig: ChatbotConfig | null;
  login: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  fetchChatbot: () => Promise<ChatbotConfig | null>;
}

const UserContext = createContext<User | undefined>(undefined);

const UserProvier = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<
    "authenticated" | "unauthenticated" | "loading"
  >("loading");
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig | null>(
    null
  );

  useEffect(() => {
    const checkAuth = () => {
      const token = getLs("token");
      const storedUserId = getLs("user_id");
      const expiresAt = getLs("expires_at");

      if (token && storedUserId) {
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          const expirationTime = tokenData.exp * 1000;

          if (Date.now() >= expirationTime) {
            logout();
          } else {
            setUserId(storedUserId);
            setStatus("authenticated");
          }
        } catch (error) {
          console.error("Error parsing token:", error);
          logout();
        }
      } else {
        setStatus("unauthenticated");
      }
    };

    checkAuth();
  }, []);
  

  const fetchChatbot = async () => {
    if (!userId) {
      return null;
    }
    const storeConfig = localStorage.getItem("embeddable.config");
    if (storeConfig) {
      const parsedConfig = JSON.parse(storeConfig);
      setChatbotConfig(parsedConfig);
      return parsedConfig;
    }
    try {
      const res = await api.post("/getbot", { user_id: userId });
      if (res.data.success) {
        const fetchedConfig = res.data.chatbot;
        localStorage.setItem(
          "embeddable.config",
          JSON.stringify(fetchedConfig)
        );
        setChatbotConfig(fetchedConfig);
        return fetchedConfig;
      } else {
        t("No Chatbot found", "success");
      }
    } catch (err) {
      console.error(err);
      t("Failed to Fetch", "error");
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<any> => {
    try {
      const res = await api.post("/login", { email, password });

      if (res.data.success) {
        setUserId(res.data.user_id);
        setStatus("authenticated");

        setLs("token", res.data.token);
        setLs("user_id", res.data.user_id);
        setLs("expires_at", res.data.expires_at);

        t("Login successful!", "success");
        return;
      }
      setStatus("unauthenticated");

      if (res.data.message === "Email not verified") {
        resendVerification(email);
        t("Email not verified, New email sent", "error");
        return;
      }
      t(res.data.message || "Login failed", "error");
    } catch (error) {
      console.error("Login error:", error);
      setStatus("unauthenticated");
      return;
    }
  };

  const register = async (email: string, password: string): Promise<any> => {
    try {
      const res = await api.post("/register", { email, password });

      if (res.data.success) {
        t("Registration successful! Please verify your email.", "success");
        return;
      }
      t(res.data.message || "Registration failed", "error");
      return;
    } catch (error) {
      console.error("Registration error:", error);
      return;
    }
  };

  const logout = () => {
    setUserId("");
    setStatus("unauthenticated");
    setChatbotConfig(null);
    clearLocalStorage();
  };

  const resendVerification = async (email: string) => {
    try {
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
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("embeddable.token");
    localStorage.removeItem("embeddable.user_id");
    localStorage.removeItem("embeddable.expires_at");
    localStorage.removeItem("embeddable.config");
    localStorage.removeItem("embeddable.embedconfig");
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        status,
        chatbotConfig,
        login,
        register,
        logout,
        fetchChatbot,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvier, useUser };
