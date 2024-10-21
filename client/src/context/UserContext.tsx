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
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
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
    const token = localStorage.getItem("embeddable.token");
    const userId = localStorage.getItem("embeddable.userId");

    if (token && userId) {
      setUserId(userId);
      setStatus("authenticated");
    } else setStatus("unauthenticated");
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/login", { email, password });
      console.log(res.data);
      if (res.data.success) {
        setUserId(res.data.userId);
        setStatus("authenticated");
        localStorage.setItem("embeddable.token", res.data.token);
        localStorage.setItem("embeddable.userId", res.data.userId);
        return true;
      } else {
        setStatus("unauthenticated");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setStatus("unauthenticated");
      return false;
    }
  };

  const register = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const res = await api.post("/register", { email, password });
      if (res.data.success) {
        setUserId(res.data.userId);
        setStatus("authenticated");
        localStorage.setItem("embeddable.token", res.data.token);
        localStorage.setItem("embeddable.userId", res.data.userId);
        return true;
      } else {
        setStatus("unauthenticated");
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus("unauthenticated");
      return false;
    }
  };

  const logout = () => {
    setUserId("");
    setStatus("unauthenticated");
    setChatbotConfig(null);
    localStorage.removeItem("embeddable.token");
    localStorage.removeItem("embeddable.userId");
    localStorage.removeItem("embeddable.config");
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
