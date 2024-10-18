import {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ChatbotConfig } from "../utils/types";
import api from "../utils/axios";

interface User {
  userId: string;
  status: "authenticated" | "unauthenticated" | "loading";
  chatbotConfig: ChatbotConfig;
  setChatbotConfig: (config: ChatbotConfig) => void;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const UserContext = createContext<User | undefined>(undefined);

const UserProvier = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<
    "authenticated" | "unauthenticated" | "loading"
  >("loading");
  const [chatbotConfig, setChatbotConfig] = useState<ChatbotConfig>({
    logo_url: "",
    image_url: "",
    user_name: "",
    website_url: "",
    chatbot_type: "personal",
    home_message: "",
    description: "",
    contact_link: "",
    default_questions: [""],
    greeting_message: "",
    error_response: "",
    ai_configuration: [],
  });
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
    if (status === "authenticated") {
      // api.get(`/chatbot/${userId}`).then((res) => {
      //     setChatbotConfig(res.data);
      //     setChatbotId(res.data._id);
      // });
    }
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
