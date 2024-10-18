import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  userId: string | null;
  status: "authenticated" | "loading" | "unauthenticated";
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "authenticated" | "loading" | "unauthenticated"
  >("loading");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUserId(userId);
      setStatus("authenticated");
    } else {
      setUserId(null);
      setStatus("unauthenticated");
    }
  }, []);

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ status, userId, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
};

export { useAuth };
