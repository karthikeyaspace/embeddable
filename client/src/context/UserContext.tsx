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
      const token = localStorage.getItem("embeddable.token");
      const storedUserId = localStorage.getItem("embeddable.userId");

      if (token && storedUserId) {
        try {
          const tokenData = JSON.parse(atob(token.split(".")[1]));
          const expirationTime = tokenData.exp * 1000; // Convert to milliseconds

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

  useEffect(() => {
    if (status === "authenticated") fetchChatbot();
  }, [status, userId]);

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

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post("/login", { email, password });

      if (res.data.success && res.data.token && res.data.user_id) {
        setUserId(res.data.user_id);
        setStatus("authenticated");
        localStorage.setItem("embeddable.token", res.data.token);
        localStorage.setItem("embeddable.userId", res.data.user_id);
        return {
          success: true,
          message: "Successfully logged in",
        };
      }

      setStatus("unauthenticated");
      return {
        success: false,
        message: res.data.message || "Invalid credentials",
      };
    } catch (error) {
      console.error("Login error:", error);
      setStatus("unauthenticated");
      return {
        success: false,
        message: "An error occurred during login",
      };
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post("/register", { email, password });

      if (res.data.success) {
        return {
          success: true,
          message:
            res.data.message ||
            "Registration successful. Please verify your email.",
        };
      }

      return {
        success: false,
        message: res.data.message || "Registration failed",
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "An error occurred during registration",
      };
    }
  };

  const logout = () => {
    setUserId("");
    setStatus("unauthenticated");
    setChatbotConfig(null);
    clearLocalStorage();
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("embeddable.token");
    localStorage.removeItem("embeddable.userId");
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
