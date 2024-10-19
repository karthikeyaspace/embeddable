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
  setChatbotConfig: (config: ChatbotConfig) => void;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchChatbot: () => void;
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
  // fetch for status - valid token

  useEffect(() => {
    // now just check for token and userId in local storage
    const token = localStorage.getItem("embeddable.token");
    const userId = localStorage.getItem("embeddable.userId");

    if (token && userId) {
      setUserId(userId);
      setStatus("authenticated");
    } else setStatus("unauthenticated");
  }, []);

  const fetchChatbot = async () => {
    const storeConfig = localStorage.getItem("embeddable.config");
    if (storeConfig) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setChatbotConfig(JSON.parse(storeConfig));
      return;
    }
    try {
      const res = await api.post("/chatbot", { user_id: userId });
      console.log(res.data);
      if (res.data.success) {
        localStorage.setItem(
          "embeddable.config",
          JSON.stringify(res.data.chatbot)
        );
        setChatbotConfig(res.data.chatbots);
      } else t("No Chatbot found", "success");
    } catch (err) {
      t("Failed to Fetch", "error");
      console.error(err);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    return await api
      .post("/login", { username, password })
      .then((res) => {
        if (res.data.success) {
          setUserId(res.data.userId);
          setStatus("authenticated");
          return true;
        } else {
          setStatus("unauthenticated");
          return false;
        }
      })
      .catch(() => {
        setStatus("unauthenticated");
        return false;
      });
  };

  const register = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    return await api
      .post("/register", { username, password })
      .then((res) => {
        if (res.data.success) {
          setUserId(res.data.userId);
          setStatus("authenticated");
          return true;
        } else {
          setStatus("unauthenticated");
          return false;
        }
      })
      .catch(() => {
        setStatus("unauthenticated");
        return false;
      });
  };

  const logout = () => {
    setUserId("");
    setStatus("unauthenticated");
  };

  useEffect(() => {
    if (status === "authenticated") fetchChatbot();
    else return;
  }, [status, userId]);

  return (
    <UserContext.Provider
      value={{
        userId,
        status,
        chatbotConfig,
        setChatbotConfig,
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
